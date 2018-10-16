import { appointment } from './../../../../services/facility-manager/setup/devexpress.service';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Component, ViewChild, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {
    FacilitiesService, AppointmentService, AppointmentTypeService, ProfessionService, EmployeeService, WorkSpaceService, SchedulerService
} from '../../../../services/facility-manager/setup/index';
import {
    Facility, Employee, ClinicModel, AppointmentType, Appointment, Profession, ScheduleRecordModel, User
} from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { IDateRange } from 'ng-pick-daterange';
import { Router } from '@angular/router';
import {IPagerSource} from "../../../../core-ui-modules/ui-components/PagerComponent";

@Component({
    selector: 'app-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
    paginationObj: IPagerSource = {totalPages: 0, totalRecord: 0, pageSize: 10, currentPage: 0};
    @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() closeModal: Boolean;
    selectedFacility: Facility = <Facility>{};
    loginEmployee: Employee = <Employee>{};
    selectedProfession: Profession = <Profession>{};
    clinics: any[] = [];
    user: User = <User>{};
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
    isCheckoutPatient = false;
    patientDetails = {};
    selectedAppointment = {};
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
    loading: Boolean = false;

    dayCount = ['Today', 'Last 3 Days', 'Last Week', 'Last 2 Weeks', 'Last Month'];


    constructor(private locker: CoolLocalStorage, private appointmentService: AppointmentService,
        private appointmentTypeService: AppointmentTypeService, private professionService: ProfessionService,
        private employeeService: EmployeeService, private workSpaceService: WorkSpaceService, private facilityService: FacilitiesService,
        private scheduleService: SchedulerService, private authFacadeService: AuthFacadeService, private router:Router) {

        this.clinicCtrl = new FormControl();
        this.clinicCtrl.valueChanges.subscribe(val => {
            this.filterClinics(val);
        })

        this.providerCtrl = new FormControl();
        this.filteredProviders = this.providerCtrl.valueChanges
            .startWith(null)
            .map((provider: Employee) => provider && typeof provider === 'object' ? provider.personDetails.lastName : provider)
            .map(val => val ? this.filterProviders(val) : this.filterProviders(''));

        this.typeCtrl = new FormControl();
        this.filteredAppointmentTypes = this.typeCtrl.valueChanges
        .startWith(null)
        .map((appointmentType: AppointmentType) => appointmentType && typeof appointmentType === 'object' ? appointmentType.name : appointmentType)
        .map(val => val ? this.filterAppointmentTypes(val) : this.filterAppointmentTypes(''));

        this.statusCtrl = new FormControl();

        this.todayCtrl = new FormControl();
        this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
        this.auth = <any>this.locker.getObject('auth');
    }

    ngOnInit() {
        this.authFacadeService.getLogingEmployee().then((payload: any) => {
            this.loginEmployee = payload;
            this.user = <User>this.locker.getObject('auth');
            this.prime();
        });


        this.employeeService.loginEmployeeAnnounced$.subscribe(employee => {
            this.loginEmployee = employee;
            this.prime();
        })

    }

    getClinics() {
        this.clinics = [];
        const clinicIds = [];

        this.selectedFacility.departments.forEach((itemi, i) => {
            itemi.units.forEach((itemj, j) => {
                itemj.clinics.forEach((itemk, k) => {
                    if (this.loginEmployee !== undefined && this.loginEmployee.professionId === 'Doctor') {
                        this.loginEmployee.units.forEach((itemu, u) => {
                            if (itemu === itemj.name) {
                                const clinicModel: ClinicModel = <ClinicModel>{};
                                clinicModel.clinic = itemk;
                                clinicModel.department = itemi;
                                clinicModel.unit = itemj;
                                clinicModel._id = itemk._id;
                                clinicModel.clinicName = itemk.clinicName;
                                this.clinics.push(clinicModel);
                                clinicIds.push(clinicModel.clinicName);
                            }
                        });
                    } else if (this.loginEmployee !== undefined && this.loginEmployee.professionId !== 'Doctor') {
                        this.loginEmployee.workSpaces.forEach((wrk, ii) => {
                            wrk.locations.forEach((lct, li) => {
                                this.schedules.forEach((sch: any, ji) => {
                                    sch.schedules.forEach((sch2, jji) => {
                                        if (sch2.location._id === lct.minorLocationId && sch.clinic === itemk.clinicName) {
                                            if (clinicIds.filter(x => x === itemk._id).length === 0) {
                                                if(this.clinics.findIndex(x =>x._id===itemk._id) === -1){
                                                    const clinicModel: ClinicModel = <ClinicModel>{};
                                                    clinicModel.clinic = sch.clinic;
                                                    clinicModel.department = itemi;
                                                    clinicModel.unit = itemj;
                                                    clinicModel._id = itemk._id;
                                                    clinicModel.clinicName = itemk.clinicName;
                                                    this.clinics.push(clinicModel);
                                                    clinicIds.push(clinicModel.clinicName);
                                                }
                                                
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
        this._getAppointments(clinicIds);
    }

    
    _getAppointments(clinicIds: any) {
        this.loading = true;
        this.appointmentService.findAppointment({
            query:
                {
                    isFuture: true, 'facilityId': this.selectedFacility._id, 'clinicIds': clinicIds
                }
        }).subscribe(payload => {
            this.loading = false;
            this.filteredAppointments = this.appointments = payload.data;
            console.log("APPOINTMENT Called" , payload);
        }, error => {
            this.loading = false;
            this._getAppointments(clinicIds);
        });
    }
    checkOutToWard(appointment) {
        this.patientDetails = appointment.patientDetails;
        this.selectedAppointment = appointment;
        this.isCheckoutPatient = true;
    }

    close_onClick(message: boolean) {
        this.isCheckoutPatient = false;
        this.closeMenu.emit(true);
    }

    prime() {
        try {
            if (this.loginEmployee._id !== undefined) {
                this.loadIndicatorVisible = true;
                // this.getClinics();
                this.subscription = Observable.forkJoin(
                    [
                        // Observable.fromPromise(this.workSpaceService.find({ query: { 'employeeId._id': this.loginEmployee._id } })),
                        Observable.fromPromise(this.appointmentTypeService.find({})),
                        Observable.fromPromise(this.professionService.find({})),
                        Observable.fromPromise(this.scheduleService.find({ query: { facilityId: this.selectedFacility._id } }))
                    ])
                    .subscribe((results: any) => {
                        // this.loginEmployee.workSpaces = results[0].data;
                        this.appointmentTypes = results[0].data;
                        const professions = results[1].data;
                        this.schedules = results[2].data;
                        const filteredProfessions = professions.filter(x => x.name === 'Doctor');
                        if (filteredProfessions.length > 0) {
                            this.selectedProfession = filteredProfessions[0];
                        }
                        if (this.loginEmployee !== undefined) {
                            // this.selectedProfession = this.loginEmployee.professionObject;
                            if (this.loginEmployee.professionId === 'Doctor') {
                                this.isDoctor = true;
                            }
                           
                            this.getEmployees();
                        }
                        this.getClinics();
                    }, error => {
                        this.loadIndicatorVisible = false;
                        this.prime();
                    });
            }
        } catch (error) {
        }

    }
    getEmployees() {
        this.loadingProvider = true;
        this.providers = [];
        if (this.isDoctor) {
            this.employeeService.find({
                query: {
                    facilityId: this.selectedFacility._id,
                    professionId: this.selectedProfession.name, units: { $in: this.loginEmployee.units }
                }
            }).then(payload => {
                payload.data.forEach((itemi, i) => {
                    this.providers.push(itemi);
                    if (this.loginEmployee._id !== undefined && this.selectedProfession._id !== undefined) {
                    }
                });
                this.loadingProvider = false;
            }).catch(error => {
                this.getEmployees();
            });
        } else {
            this.employeeService.find({
                query: {
                    facilityId: this.selectedFacility._id,
                    professionId: this.selectedProfession.name
                }
            }).then(payload => {
                payload.data.forEach((itemi, i) => {
                    this.providers.push(itemi);
                });
                this.loadingProvider = false;
            }).catch(error => {
                this.getEmployees();
            });
        }

    }

    setReturnValue(dateRange: IDateRange): any {
        if(dateRange !== null){
            this.loading = true;
            this.dateRange = dateRange;
            this.appointmentService.findAppointment({
                query: {
                    isWithinRange: true, from: this.dateRange.from, to: this.dateRange.to,
                    'facilityId': this.selectedFacility._id,
                }
            }).subscribe(payload => {
                this.loading = false;
                this.filteredAppointments = this.appointments = payload.data;
            });
        }
       
    }
    getAppointmentTypes() {
        this.appointmentTypeService.findAll().subscribe(payload => {
            this.appointmentTypes = payload.data;
        })
    }
    filterClinics(val: any) {
        this.filteredAppointments = val ? this.appointments
            .filter(s => s.clinicId.toLowerCase().indexOf(val.clinicName.toLowerCase()) === 0) : this.appointments;
    }
    filterProviders(val: any) {
        this.filteredAppointments = this.appointments;
        const smallApp = this.appointments.filter(m =>m.doctorId !== undefined);
        if(val.length !== 0){
            this.filteredAppointments = val ? smallApp
            .filter(s => s.providerDetails.personDetails.lastName.toLowerCase()
                .includes(val.toLowerCase())
                || s.providerDetails.personDetails.firstName.toLowerCase().includes(val.toLowerCase())) : smallApp;
        }else{
            this.filteredAppointments = this.appointments;
        }
       
        return val ? this.providers.filter(s => s.personDetails.lastName.toLowerCase().indexOf(val.toLowerCase()) === 0
            || s.personDetails.firstName.toLowerCase().indexOf(val.toLowerCase()) === 0)
            : this.providers;
    }
    filterAppointmentTypes(val: any) {
        this.filteredAppointments = val ? this.appointments
        .filter(s => s.appointmentTypeId.toLowerCase().indexOf(val.name.toLowerCase()) === 0) : this.appointments;
        return val ? this.appointmentTypes.filter(s => s.name.toLowerCase().indexOf(val.toLowerCase()) === 0)
            : this.appointmentTypes;
    }
    displayFn(clinic: any): string {
        return clinic ? clinic.clinicName : clinic;
    }
    providerDisplayFn(provider: any): string {
        return provider ? provider.personDetails.lastName + ' ' + provider.personDetails.firstName : provider;
    }

    appointmentTypeDisplayFn(type: any): string {
        return type ? type.name : type;
    }

    // Notification
    private _notification(type: String, text: String): void {
        this.facilityService.announceNotification({
            users: [this.user._id],
            type: type,
            text: text
        });
    }

    editAppointment(appointment){
        // [routerLink]="['/dashboard/clinic/schedule-appointment', appointment._id]"
        this.router.navigate(['/dashboard/clinic/schedule-appointment', appointment._id]) ;
    }
}
