import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {
    FacilitiesService, SchedulerService, AppointmentService, AppointmentTypeService, ProfessionService, EmployeeService,
    WorkSpaceService, PatientService
} from '../../../../../services/facility-manager/setup/index';
import { Facility, Employee, ClinicModel, AppointmentType, Appointment, Profession, Patient } from '../../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-schedule-frm',
    templateUrl: './schedule-frm.component.html',
    styleUrls: ['./schedule-frm.component.scss']
})

export class ScheduleFrmComponent implements OnInit {

    mainErr = true;
    errMsg = 'you have unresolved errors';
    selectedFacility: Facility = <Facility>{};
    loginEmployee: Employee = <Employee>{};
    selectedProfession: Profession = <Profession>{};
    clinics: any[] = [];
    patients: Patient[] = [];
    schedules: any[] = [];

    filteredClinics: Observable<any[]>
    filteredProviders: Observable<Employee[]>
    filteredAppointmentTypes: Observable<AppointmentType[]>
    filteredPatients: Observable<Patient[]>

    appointmentTypes: AppointmentType[] = [];
    providers: Employee[] = [];
    isDoctor = false;
    loadIndicatorVisible = false;
    subscription: Subscription;
    auth: any;
    currentDate: Date = new Date();

    filteredStates: any;
    patient: FormControl;
    clinic: FormControl;
    provider: FormControl;
    type: FormControl;
    category: FormControl;
    date = new Date(); // FormControl = new FormControl();
    reason: FormControl = new FormControl();

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
        private appointmentService: AppointmentService, private patientService: PatientService,
        private appointmentTypeService: AppointmentTypeService, private professionService: ProfessionService,
        private employeeService: EmployeeService, private workSpaceService: WorkSpaceService) {
        this.patient = new FormControl();
        this.filteredPatients = this.patient.valueChanges
            .startWith(null)
            .map((patient: Patient) => patient && typeof patient === 'object' ? patient.personDetails.lastName : patient)
            .map(val => val ? this.filterPatients(val) : this.patients.slice());

        this.clinic = new FormControl();
        this.filteredClinics = this.clinic.valueChanges
            .startWith(null)
            .map(clinic => clinic && typeof clinic === 'object' ? this.getOthers(clinic) : clinic)
            .map(val => val ? this.filterClinics(val) : this.clinics.slice());

        this.provider = new FormControl();
        this.filteredProviders = this.provider.valueChanges
            .startWith(null)
            .map((provider: Employee) => provider && typeof provider === 'object' ? provider.employeeDetails.lastName : provider)
            .map(val => val ? this.filterProviders(val) : this.providers.slice());

        this.type = new FormControl();
        this.filteredAppointmentTypes = this.type.valueChanges
            .startWith(null)
            .map((type: AppointmentType) => type && typeof type === 'object' ? type.name : type)
            .map(val => val ? this.filterAppointmentTypes(val) : this.appointmentTypes.slice());

        this.category = new FormControl();
        this.filteredStates = this.category.valueChanges
            .startWith(null)
            .map(name => this.filterStates(name));
    }

    ngOnInit() {
        this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
        this.auth = <any>this.locker.getObject('auth');
        // this.getSchedules();
        this.getLoginEmployee();
        this.getEmployees();
        this.getAppointmentTypes();
        this.getPatients();
    }
    getOthers(clinic: any) {
        console.log(clinic);
        this.scheduleService.find({ query: { clinicId: clinic._id } })
            .subscribe(payload => {
                this.schedules = payload.data;
                console.log(this.schedules);
            })
    }

    getClinics() {
        this.clinics = [];
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
                console.log(payload);
            })
    }

    getPatients() {
        this.patientService.find({ query: { facilityId: this.selectedFacility._id } })
            .subscribe(payload => {
                this.patients = payload.data;
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
        this.subscription = emp$.mergeMap((emp: any) => Observable.forkJoin([Observable.fromPromise(this.employeeService.get(emp.data[0]._id, {})),
        ]))
            .subscribe((results: any) => {
                console.log(results)
                this.loginEmployee = results[0];
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
                        console.log(this.providers);
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
                    console.log(this.providers);
                    if (this.loginEmployee !== undefined && this.selectedProfession._id !== undefined) {
                        this.workSpaceService.find({ query: { employeeId: this.loginEmployee._id } }).then(payloade => {
                        });
                    }
                });
        }

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
    filterPatients(val: any) {
        return val ? this.patients.filter(s => s.personDetails.lastName.toLowerCase().indexOf(val.toLowerCase()) === 0
            || s.personDetails.firstName.toLowerCase().indexOf(val.toLowerCase()) === 0)
            : this.patients;
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
    patientDisplayFn(patient: any) {
        return patient ? patient.personDetails.lastName + ' ' + patient.personDetails.firstName : patient;
    }

    filterStates(val: string) {
        return val ? this.states.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
            : this.states;
    }
    clickMe() {
        console.log('you clicked me');
    }

}
