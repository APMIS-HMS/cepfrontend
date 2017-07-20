import { Component, ViewChild, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import {
    FacilitiesService, SchedulerService, AppointmentService, AppointmentTypeService, ProfessionService, EmployeeService, WorkSpaceService
} from '../../../../services/facility-manager/setup/index';
import { Facility, Employee, ClinicModel, AppointmentType, Appointment, Profession, ScheduleRecordModel } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-new-appointment',
    templateUrl: './new-appointment.component.html',
    styleUrls: ['./new-appointment.component.scss']
})
export class NewAppointmentComponent implements OnInit {
    selectedFacility: Facility = <Facility>{};
    loginEmployee: Employee = <Employee>{};
    selectedProfession: Profession = <Profession>{};
    clinics: any[] = [];
    schedules: ScheduleRecordModel[] = [];

    filteredClinics: Observable<any[]>
    filteredProviders: Observable<Employee[]>
    filteredAppointmentTypes: Observable<AppointmentType[]>

    appointmentTypes: AppointmentType[] = [];
    providers: Employee[] = [];
    appointments: any[] = [];
    pastAppointments: any[] = [];
    isDoctor = false;
    loadIndicatorVisible = false;
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
    selectedPatient: any = <any>{};
    selectedClinic: any = <any>{};
    dateRange: any;

    dayCount = ['Today', 'Last 3 Days', 'Last Week', 'Last 2 Weeks', 'Last Month'];

    states = [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
    ];

    constructor(private scheduleService: SchedulerService, private locker: CoolSessionStorage,
        private appointmentService: AppointmentService, private facilityService: FacilitiesService,
        private appointmentTypeService: AppointmentTypeService, private professionService: ProfessionService,
        private employeeService: EmployeeService, private workSpaceService: WorkSpaceService) {

        this.appointmentService.schedulesAnnounced$.subscribe((payload: ScheduleRecordModel[]) => {
            this.schedules = payload;
        });

        this.appointmentService.patientAnnounced$.subscribe((payload: any) => {
            this.selectedPatient = payload;
            this.getPreviousAppointments(payload);
        });

        this.appointmentService.clinicAnnounced$.subscribe((payload: any) => {
            this.getClinicAppointments(payload);
        })

        this.clinicCtrl = new FormControl();
        this.filteredClinics = this.clinicCtrl.valueChanges
            .startWith(null)
            .map(clinic => clinic && typeof clinic === 'object' ? clinic.clinicName : clinic)
            .map(val => val ? this.filterClinics(val) : this.clinics.slice());

        this.providerCtrl = new FormControl();
        this.filteredProviders = this.providerCtrl.valueChanges
            .startWith(null)
            .map((provider: Employee) => provider && typeof provider === 'object' ? provider.employeeDetails.lastName : provider)
            .map(val => val ? this.filterProviders(val) : this.providers.slice());

        this.typeCtrl = new FormControl();
        this.filteredAppointmentTypes = this.typeCtrl.valueChanges
            .startWith(null)
            .map((type: AppointmentType) => type && typeof type === 'object' ? type.name : type)
            .map(val => val ? this.filterAppointmentTypes(val) : this.appointmentTypes.slice());

        this.statusCtrl = new FormControl();
        this.filteredStates = this.statusCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterStates(name));

        this.todayCtrl = new FormControl();
        this.filteredStates = this.statusCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterStates(name));
    }

    ngOnInit() {
        this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
        this.auth = <any>this.locker.getObject('auth');
        this.getSchedules();
        this.getLoginEmployee();
        this.getEmployees();
        // this.getAppointmentTypes();
    }
    getClinicAppointments(value) {
        console.log(value);
        this.selectedClinic = value.clinicId;
        this.appointmentService.find({ query: { 'clinicId._id': value.clinicId._id, hasDate: true, startDate: value.startDate } })
            .subscribe(payload => {
                this.appointments = payload.data;
                console.log(this.appointments)
            })
    }
    setReturnValue(dateRange: any): any {
        this.dateRange = dateRange;
        console.log(this.dateRange);
        this.appointmentService.find({
            query: {
                isWithinRange: true, from: this.dateRange.from, to: this.dateRange.to,
                'facilityId._id': this.selectedFacility._id,
                'patientId._id': this.selectedPatient._id
            }
        }).subscribe(payload => {
            console.log(payload);
            this.appointments = payload.data;
        })
    }
    getPreviousAppointments(value) {
        this.pastAppointments = [];
        if (value._id !== undefined) {
            this.appointmentService.find({ query: { 'patientId._id': value._id } }).subscribe(payload => {
                this.pastAppointments = payload.data;
                console.log(this.pastAppointments)
            });
        }
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
                        this.loginEmployee.workSpaces.forEach((itemw, w) => {
                            itemw.locations.forEach((iteml, l) => {
                                if (iteml.minorLocationId === itemk.clinicLocation) {
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
                        });
                    }
                });
            });
        });
        this.loadIndicatorVisible = false;
    }
    getSchedules() {
        this.scheduleService.find({ query: { facilityId: this.selectedFacility._id } })
            .subscribe(payload => {
            })
    }

    getLoginEmployee() {
        this.loadIndicatorVisible = true;
        const emp$ = Observable.fromPromise(this.employeeService.find({
            query: {
                facilityId: this.selectedFacility._id, personId: this.auth.data.personId, showbasicinfo: true
            }
        }));
        // tslint:disable-next-line:max-line-length
        this.subscription = emp$.mergeMap((emp: any) => Observable.forkJoin(
            [
                Observable.fromPromise(this.employeeService.get(emp.data[0]._id, {})),
                Observable.fromPromise(this.workSpaceService.find({ query: { employeeId: emp.data[0]._id } })),
                Observable.fromPromise(this.appointmentTypeService.findAll())
            ]))
            .subscribe((results: any) => {
                this.loginEmployee = results[0];
                this.loginEmployee.workSpaces = results[1].data;
                this.appointmentTypes = results[2].data;
                if (this.loginEmployee !== undefined && this.loginEmployee.professionObject !== undefined) {
                    this.selectedProfession = this.loginEmployee.professionObject;
                    if (this.loginEmployee.professionObject.name === 'Doctor') {
                        this.isDoctor = true;
                    }
                    this.getClinics();
                }
            });
    }
    getEmployees() {
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

                    if (this.loginEmployee !== undefined && this.selectedProfession._id !== undefined) {
                        this.workSpaceService.find({ query: { employeeId: this.loginEmployee._id } }).then(payloade => {
                        });
                    }
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
                    if (this.loginEmployee !== undefined && this.selectedProfession._id !== undefined) {
                        this.workSpaceService.find({ query: { employeeId: this.loginEmployee._id } }).then(payloade => {
                        });
                    }
                });
        }

    }
    editAppointment(appointment) {
        this.appointmentService.appointmentAnnounced(appointment);
    }
    cancelAppointment(appointment) {
        appointment.isActive = false;
        this.appointmentService.update(appointment).subscribe(payload => {
            this.appointmentService.patientAnnounced(this.selectedPatient);
        })
    }
    getAppointmentTypes() {
        this.appointmentTypeService.findAll().subscribe(payload => {
            this.appointmentTypes = payload.data;
        })
    }
    filterClinics(val: any) {
        return val ? this.clinics.filter(s => s.clinicName.toLowerCase().indexOf(val.toLowerCase()) === 0)
            : this.clinics;

    }
    filterProviders(val: any) {
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
        return provider ? provider.employeeDetails.lastName + ' ' + provider.employeeDetails.lastName : provider;
    }

    appointmentTypeDisplayFn(type: any): string {
        return type ? type.name : type;
    }

    filterStates(val: string) {
        return val ? this.states.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
            : this.states;
    }

}
