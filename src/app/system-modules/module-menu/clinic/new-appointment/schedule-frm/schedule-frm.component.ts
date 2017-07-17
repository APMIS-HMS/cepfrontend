import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {
    FacilitiesService, SchedulerService, AppointmentService, AppointmentTypeService, ProfessionService, EmployeeService,
    WorkSpaceService, PatientService, FacilitiesServiceCategoryService
} from '../../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../../services/module-manager/setup/index';
import {
    Facility, Employee, ClinicModel, AppointmentType, Appointment, Profession, Patient, ScheduleRecordModel, MinorLocation
} from '../../../../../models/index';
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
    clinicLocations: MinorLocation[] = [];
    // schedules: any[] = [];

    filteredClinics: Observable<any[]>
    filteredProviders: Observable<Employee[]>
    filteredAppointmentTypes: Observable<AppointmentType[]>
    filteredPatients: Observable<Patient[]>
    filteredCategoryServices: Observable<any[]>

    appointmentTypes: AppointmentType[] = [];
    providers: Employee[] = [];
    schedules: ScheduleRecordModel[] = [];
    scheduleManagers: ScheduleRecordModel[] = [];
    professions: Profession[] = [];
    categoryServices: any[] = [];
    isDoctor = false;
    loadIndicatorVisible = false;
    subscription: Subscription;
    auth: any;
    currentDate: Date = new Date();
    clinicMajorLocation: any;
    filteredStates: any;
    patient: FormControl;
    clinic: FormControl;
    provider: FormControl;
    type: FormControl;
    category: FormControl;
    checkIn: FormControl;
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
        private employeeService: EmployeeService, private workSpaceService: WorkSpaceService,
        private locationService: LocationService, private facilityServiceCategoryService: FacilitiesServiceCategoryService) {

        this.checkIn = new FormControl(false);

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
        this.filteredCategoryServices = this.category.valueChanges
            .startWith(null)
            .map((type: any) => type && typeof type === 'object' ? type.name : type)
            .map(val => val ? this.filterCategoryServices(val) : this.categoryServices.slice());
    }

    ngOnInit() {
        this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
        this.auth = <any>this.locker.getObject('auth');
        // this.getSchedules();
        // // this.getLoginEmployee();
        // this.getClinicMajorLocation();
        // this.getEmployees();
        // this.getAppointmentTypes();
        // this.getPatients();
        this.primeComponent();
    }
    primeComponent() {

        const emp$ = Observable.fromPromise(this.employeeService.find({
            query: {
                facilityId: this.selectedFacility._id, personId: this.auth.data.personId, showbasicinfo: true
            }
        }));
        const empMergeMap$ = emp$.mergeMap((emp: any) => Observable.forkJoin([Observable
            .fromPromise(this.employeeService.get(emp.data[0]._id, {})),
        ]))
        const majorLocation$ = Observable.fromPromise(this.locationService.find({ query: { name: 'Clinic' } }));
        const appointmentTypes$ = Observable.fromPromise(this.appointmentTypeService.findAll());
        const patient$ = Observable.fromPromise(this.patientService.find({ query: { facilityId: this.selectedFacility._id } }));
        const schedule$ = Observable.fromPromise(this.scheduleService.find({ query: { facilityId: this.selectedFacility._id } }));
        const loginEmployee$ = empMergeMap$;
        const professions$ = Observable.fromPromise(this.professionService.findAll());
        const facilityServiceCategory$ = Observable.fromPromise(this.facilityServiceCategoryService
            .find({ query: { facilityId: this.selectedFacility._id } }));

        Observable.forkJoin([majorLocation$, appointmentTypes$, patient$, schedule$, loginEmployee$, professions$,
            facilityServiceCategory$]).subscribe((results: any) => {
                results[0].data.forEach((itemi, i) => {
                    if (itemi.name === 'Clinic') {
                        this.clinicMajorLocation = itemi;
                    }
                });
                this.appointmentTypes = results[1].data;
                this.patients = results[2].data;
                const schedules = results[3].data;
                this.professions = results[5].data;
                if (results[6].data.length > 0) {
                    const categories = results[6].data[0].categories;
                    const filterCategories = categories.filter(x => x.name === 'Appointment');
                    if (filterCategories.length > 0) {
                        this.categoryServices = filterCategories[0].services;
                    }

                }

                if (results[4].length > 0) {
                    this.loginEmployee = results[4][0];
                    console.log(this.categoryServices);
                    if (this.loginEmployee.professionObject.name === 'Doctor') {
                        this.selectedProfession = this.professions.filter(x => x._id === this.loginEmployee.professionId)[0];
                        this.isDoctor = true;
                    } else {
                        this.isDoctor = false;
                    }
                }
                this.scheduleManagers = schedules;
                this.getEmployees();
                this.getClinics()
            })
    }
    getOthers(clinic: any) {
        this.schedules = [];
        clinic.schedules.forEach((itemi, i) => {
            this.schedules.push(itemi);
        });
        this.appointmentService.schedulesAnnounced(this.schedules);
    }
    getClinicMajorLocation() {
        this.locationService.findAll().then(payload => {
            payload.data.forEach((itemi, i) => {
                if (itemi.name === 'Clinic') {
                    this.clinicMajorLocation = itemi;
                    this.getLoginEmployee();
                }
            });
        });
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

        this.clinics.forEach((itemc, c) => {
            const filteredManangers = this.scheduleManagers.filter(x => x.locationType.clinic._id === itemc._id);
            if (filteredManangers.length > 0) {
                itemc.schedules = filteredManangers[0].schedules;
                // itemc.schedules.forEach((itemi, i) => {
                //     // this.schedules.push(itemi);
                // });
            }
        });
        this.loadIndicatorVisible = false;
    }
    getClinicLocation() {
        this.clinicLocations = [];
        const inClinicLocations: MinorLocation[] = [];
        const minors = this.selectedFacility.minorLocations.filter(x => x.locationId === this.clinicMajorLocation._id);
        minors.forEach((itemi, i) => {
            const minorLocation: MinorLocation = <MinorLocation>{};
            minorLocation._id = itemi._id;
            minorLocation.description = itemi.description;
            minorLocation.locationId = itemi.locationId;
            minorLocation.name = itemi.name;
            minorLocation.shortName = itemi.shortName;
            minorLocation.text = itemi.name;
            inClinicLocations.push(minorLocation);
        });
        if (this.loginEmployee.professionObject !== undefined && this.loginEmployee.professionObject.name === 'Doctor') {
            this.schedules.forEach((items, s) => {
                this.loginEmployee.units.forEach((itemu, u) => {
                    if (itemu === items.locationType.unit._id) {
                        const res = inClinicLocations.filter(x => x._id === items.locationType.clinic.clinicLocation);
                        if (res.length > 0) {
                            this.clinicLocations.push(res[0]);
                        }
                    }
                });
            });
        } else {
            this.loginEmployee.workSpaces.forEach((itemw, w) => {
                itemw.locations.forEach((iteml, l) => {
                    const res = inClinicLocations.filter(x => x._id === iteml.minorLocationId);
                    if (res.length > 0) {
                        this.clinicLocations.push(res[0]);
                    }
                });
            });
        }

    }
    getSchedules() {
        this.scheduleService.find({ query: { facilityId: this.selectedFacility._id } })
            .subscribe(payload => {
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
    filterCategoryServices(val: any) {
        return val ? this.categoryServices.filter(s => s.name.toLowerCase().indexOf(val.toLowerCase()) === 0)
            : this.categoryServices;
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

    categoryServiceDisplayFn(category: any) {
        return category ? category.name : category;
    }

    scheduleAppointment() {
        //        patient: FormControl;
        // clinic: FormControl;
        // provider: FormControl;
        // type: FormControl;
        // category: FormControl;
        // checkIn: FormControl;
        // date = new Date(); // FormControl = new FormControl();
        // reason: FormControl = new FormControl();
        const patient = this.patient.value;
        const clinic = this.clinic.value;
        const provider = this.provider.value;
        const type = this.type.value;
        const category = this.category.value;
        const checkIn = this.checkIn.value;
        const date = this.date;
        const reason = this.reason.value;
        const facility = this.selectedFacility;
        // console.log(patient, clinic, provider, type, category, checkIn, date, reason);
        // console.log(clinic);
        delete facility.address;
        delete facility.countryItem;
        delete facility.departments;
        delete facility.facilityClassItem;
        delete facility.facilityItem;
        delete facility.facilityModules;
        delete facility.facilitymoduleId;
        delete facility.logoObject;
        delete facility.minorLocations;

        delete patient.appointments;
        delete patient.encounterRecords;
        delete patient.orders;
        delete patient.tags;

        delete provider.department;
        delete provider.employeeFacilityDetails;
        delete provider.role;
        delete provider.units;

        const appointment: Appointment = <Appointment>{};
        appointment.appointmentReason = reason;
        appointment.appointmentTypeId = type;
        appointment.clinicId = clinic.clinic;
        appointment.doctorId = provider;
        appointment.facilityId = <any>facility;
        appointment.patientId = patient;
        console.log(appointment);

    }

    filterStates(val: string) {
        return val ? this.states.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
            : this.states;
    }
    clickMe() {
        console.log('you clicked me');
    }

}
