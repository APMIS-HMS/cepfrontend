import { Component, ViewChild, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {
    FacilitiesService, AppointmentService, AppointmentTypeService, ProfessionService, EmployeeService, WorkSpaceService, SchedulerService
} from '../../../../services/facility-manager/setup/index';
import { Facility, Employee, ClinicModel, AppointmentType, Appointment, Profession, ScheduleRecordModel } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { IDateRange } from 'ng-pick-daterange';

@Component({
    selector: 'app-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {

    selectedFacility: Facility = <Facility>{};
    loginEmployee: Employee = <Employee>{};
    selectedProfession: Profession = <Profession>{};
    clinics: any[] = [];
    // filteredClinics: any;
    filteredClinics: Observable<any[]>
    filteredProviders: Observable<Employee[]>
    filteredAppointmentTypes: Observable<AppointmentType[]>

    appointmentTypes: AppointmentType[] = [];
    providers: Employee[] = [];
    appointments: any[] = [];
    filteredAppointments: any[] = [];
    schedules: any[] = [];
    isDoctor = false;
    loadIndicatorVisible = false;
    loadingProvider = false;
    subscription: Subscription;
    auth: any;
    currentDate: Date = new Date();

    clinicCtrl: FormControl;
    providerCtrl: FormControl;
    typeCtrl: FormControl;
    statusCtrl: FormControl;
    todayCtrl: FormControl;
    searchControl: FormControl = new FormControl();
    filteredStates: any;
    dateRange: any;

    dayCount = ['Today', 'Last 3 Days', 'Last Week', 'Last 2 Weeks', 'Last Month'];


    constructor(private locker: CoolLocalStorage, private appointmentService: AppointmentService,
        private appointmentTypeService: AppointmentTypeService, private professionService: ProfessionService,
        private employeeService: EmployeeService, private workSpaceService: WorkSpaceService, private facilityService: FacilitiesService,
        private scheduleService: SchedulerService) {

        this.clinicCtrl = new FormControl();
        this.clinicCtrl.valueChanges.subscribe(val => {
            this.filterClinics(val);
        })

        this.providerCtrl = new FormControl();
        this.filteredProviders = this.providerCtrl.valueChanges
            .startWith(null)
            .map((provider: Employee) => provider && typeof provider === 'object' ? provider.employeeDetails.lastName : provider)
            .map(val => val ? this.filterProviders(val) : this.providers.slice());

        this.typeCtrl = new FormControl();


        this.statusCtrl = new FormControl();

        this.todayCtrl = new FormControl();
        this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
        this.auth = <any>this.locker.getObject('auth');
    }

    ngOnInit() {
        this.loginEmployee = <any>this.locker.getObject('loginEmployee');
        this.employeeService.loginEmployeeAnnounced$.subscribe(employee => {
            this.loginEmployee = employee;
            this.prime();
        })
        this.prime();
    }

    getClinics() {
        this.clinics = [];
        const clinicIds = [];

        this.selectedFacility.departments.forEach((itemi, i) => {
            itemi.units.forEach((itemj, j) => {
                itemj.clinics.forEach((itemk, k) => {
                    if (this.loginEmployee !== undefined && this.loginEmployee.professionObject.name === 'Doctor') {
                        this.loginEmployee.units.forEach((itemu, u) => {
                            if (itemu === itemj._id) {
                                const clinicModel: ClinicModel = <ClinicModel>{};
                                clinicModel.clinic = itemk;
                                clinicModel.department = itemi;
                                clinicModel.unit = itemj;
                                clinicModel._id = itemk._id;
                                clinicModel.clinicName = itemk.clinicName;
                                this.clinics.push(clinicModel);
                                clinicIds.push(clinicModel._id);
                            }
                        });
                    } else if (this.loginEmployee !== undefined && this.loginEmployee.professionObject.name !== 'Doctor') {
                        this.loginEmployee.workSpaces.forEach((wrk, ii) => {
                            wrk.locations.forEach((lct, li) => {
                                this.schedules.forEach((sch: any, ji) => {
                                    sch.schedules.forEach((sch2, jji) => {
                                        if (sch2.location._id === lct.minorLocationId._id && sch.clinicObject.clinic._id === itemk._id) {
                                            if (clinicIds.filter(x => x === itemk._id).length === 0) {
                                                const clinicModel: ClinicModel = <ClinicModel>{};
                                                clinicModel.clinic = sch.clinicObject.clinic;
                                                clinicModel.department = itemi;
                                                clinicModel.unit = itemj;
                                                clinicModel._id = itemk._id;
                                                clinicModel.clinicName = itemk.clinicName;
                                                this.clinics.push(clinicModel);
                                                clinicIds.push(clinicModel._id);
                                            }
                                        }
                                    })
                                })
                            })
                        })
                    }
                });
            });
        });
        this.loadIndicatorVisible = false;
        console.log(clinicIds)
        this.appointmentService.find({
            query:
            { isFuture: true, 'facilityId._id': this.selectedFacility._id, 'clinicId._id': { $in: clinicIds }, $limit: 200 }
        })
            .subscribe(payload => {
                this.filteredAppointments = this.appointments = payload.data;
                console.log(this.filteredAppointments);
            })
    }

    prime() {
        if (this.loginEmployee._id !== undefined) {
            this.loadIndicatorVisible = true;
            this.getClinics();
            this.subscription = Observable.forkJoin(
                [
                    Observable.fromPromise(this.workSpaceService.find({ query: { 'employeeId._id': this.loginEmployee._id } })),
                    Observable.fromPromise(this.appointmentTypeService.findAll()),
                    Observable.fromPromise(this.professionService.findAll()),
                    Observable.fromPromise(this.scheduleService.find({ query: { facilityId: this.selectedFacility._id } }))
                ])
                .subscribe((results: any) => {
                    this.loginEmployee.workSpaces = results[0].data;
                    this.appointmentTypes = results[1].data;
                    const professions = results[2].data;
                    this.schedules = results[3].data;
                    const filteredProfessions = professions.filter(x => x.name === 'Doctor');
                    if (filteredProfessions.length > 0) {
                        this.selectedProfession = filteredProfessions[0];
                    }
                    if (this.loginEmployee !== undefined && this.loginEmployee.professionObject !== undefined) {
                        // this.selectedProfession = this.loginEmployee.professionObject;
                        if (this.loginEmployee.professionObject.name === 'Doctor') {
                            this.isDoctor = true;
                        }
                        // this.getClinics();
                        this.getEmployees();
                    }
                });
        }
    }
    getEmployees() {
        this.loadingProvider = true;
        this.providers = [];
        if (this.isDoctor) {
            this.employeeService.find({
                query: {
                    facilityId: this.selectedFacility._id,
                    professionId: this.selectedProfession._id, units: { $in: this.loginEmployee.units }
                }
            })
                .then(payload => {
                    payload.data.forEach((itemi, i) => {
                        this.providers.push(itemi);
                        if (this.loginEmployee._id !== undefined && this.selectedProfession._id !== undefined) {
                        }
                    });
                    this.loadingProvider = false;
                });
        } else {
            this.employeeService.find({
                query: {
                    facilityId: this.selectedFacility._id,
                    professionId: this.selectedProfession._id
                }
            })
                .then(payload => {
                    payload.data.forEach((itemi, i) => {
                        this.providers.push(itemi);
                    });
                    this.loadingProvider = false;
                });
        }

    }
    setReturnValue(dateRange: IDateRange): any {
        this.dateRange = dateRange;
        this.appointmentService.find({
            query: {
                isWithinRange: true, from: this.dateRange.from, to: this.dateRange.to,
                'facilityId._id': this.selectedFacility._id
            }
        }).subscribe(payload => {
            this.filteredAppointments = this.appointments = payload.data;
        })
    }
    getAppointmentTypes() {
        this.appointmentTypeService.findAll().subscribe(payload => {
            this.appointmentTypes = payload.data;
        })
    }
    filterClinics(val: any) {
        this.filteredAppointments = val ? this.appointments
        .filter(s => s.clinicId.clinicName.toLowerCase().indexOf(val.clinicName.toLowerCase()) === 0) : this.appointments;
    }
    filterProviders(val: any) {
        this.filteredAppointments = val ? this.appointments
        .filter(s => s.doctorId !== undefined ? s.doctorId : s.doctorId.employeeDetails.lastName.toLowerCase()
        .indexOf(val.toLowerCase()) === 0
            || s.doctorId.employeeDetails.firstName.toLowerCase().indexOf(val.toLowerCase()) === 0) : this.appointments;
        return val ? this.providers.filter(s => s.employeeDetails.lastName.toLowerCase().indexOf(val.toLowerCase()) === 0
            || s.employeeDetails.firstName.toLowerCase().indexOf(val.toLowerCase()) === 0)
            : this.providers;
    }
    filterAppointmentTypes(val: any) {
        return val ? this.appointmentTypes.filter(s => s.name.toLowerCase().indexOf(val.toLowerCase()) === 0)
            : this.appointmentTypes;
    }
    displayFn(clinic: any): string {
        return clinic ? clinic.clinicName : clinic;
    }
    providerDisplayFn(provider: any): string {
        return provider ? provider.employeeDetails.lastName + ' ' + provider.employeeDetails.firstName : provider;
    }

    appointmentTypeDisplayFn(type: any): string {
        return type ? type.name : type;
    }

}
