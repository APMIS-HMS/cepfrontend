import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {
    FacilitiesService, SchedulerService, AppointmentService, AppointmentTypeService, ProfessionService, EmployeeService,
    WorkSpaceService, PatientService, FacilitiesServiceCategoryService
} from '../../../../../services/facility-manager/setup/index';
import { LocationService, OrderStatusService } from '../../../../../services/module-manager/setup/index';
import {
    Facility, Employee, ClinicModel, AppointmentType, Appointment, Profession, Patient, ScheduleRecordModel, MinorLocation
} from '../../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import * as getDay from 'date-fns/get_day';
import * as setDay from 'date-fns/set_day'
import * as getHours from 'date-fns/get_hours';
import * as setHours from 'date-fns/set_hours';

import * as setMinutes from 'date-fns/set_minutes';
import * as getMinutes from 'date-fns/get_minutes';
import * as  getYear from 'date-fns/get_year';
import * as  setYear from 'date-fns/set_year';
import * as getMonth from 'date-fns/get_month';
import * as setMonth from 'date-fns/set_month';
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
    selector: 'app-schedule-frm',
    templateUrl: './schedule-frm.component.html',
    styleUrls: ['./schedule-frm.component.scss']
})

export class ScheduleFrmComponent implements OnInit {
    @Input() selectedPatient: any;
    mainErr = true;
    errMsg = 'you have unresolved errors';
    selectedFacility: Facility = <Facility>{};
    loginEmployee: Employee = <Employee>{};
    selectedProfession: Profession = <Profession>{};
    clinics: any[] = [];
    patients: Patient[] = [];
    clinicLocations: MinorLocation[] = [];

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
    appointments: any[] = [];
    orderStatuses: any[] = [];
    selectedClinic: any = <any>{};
    isDoctor = false;
    loadIndicatorVisible = false;
    loadingPatients = false;
    loadingProviders = false;
    canCheckIn = true;
    subscription: Subscription;
    auth: any;
    currentDate: Date = new Date();
    clinicMajorLocation: any;
    filteredStates: any;
    patient: FormControl;
    clinic: FormControl;
    provider: FormControl;
    type: FormControl;
    status: FormControl;
    category: FormControl;
    checkIn: FormControl;
    date = new Date(); // FormControl = new FormControl();
    endDate = new Date();
    startDate = new Date();
    dateCtrl: FormControl = new FormControl(new Date(), [Validators.required]);
    reason: FormControl = new FormControl();
    appointment: Appointment = <Appointment>{};

    days: any[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    selectedAppointment: Appointment = <Appointment>{};
    btnText = 'Schedule Appointment';
    clinicErrorMsg = ' Clinic does not hold on the selected date!!!';
    constructor(private scheduleService: SchedulerService, private locker: CoolSessionStorage,
        private appointmentService: AppointmentService, private patientService: PatientService,
        private appointmentTypeService: AppointmentTypeService, private professionService: ProfessionService,
        private employeeService: EmployeeService, private workSpaceService: WorkSpaceService,
        private toastyService: ToastyService, private toastyConfig: ToastyConfig, private orderStatusService: OrderStatusService,
        private locationService: LocationService, private facilityServiceCategoryService: FacilitiesServiceCategoryService) {

        appointmentService.appointmentAnnounced$.subscribe((payload: any) => {
            this.appointment = payload;
            this.btnText = 'Update Appointment';
            const filterClinic = this.clinics.filter(x => x._id === payload.clinicId._id);
            if (filterClinic.length > 0) {
                this.clinic.setValue(filterClinic[0]);
            }

            this.provider.setValue(payload.doctorId);
            this.date = payload.startDate;
            this.reason.setValue(payload.appointmentReason);
            this.type.setValue(payload.appointmentTypeId);
            this.category.setValue(payload.category);
            this.status.setValue(payload.orderStatusId);
            if (payload.attendance !== undefined) {
                this.checkIn.enable();
            } else {
                this.checkIn.disable()
            }
            this.isAppointmentToday();
        })
        this.dateCtrl.valueChanges.subscribe(value => {
            this.dateChange(value);
        })
        this.checkIn = new FormControl({ value: false, disabled: this.canCheckIn });

        this.patient = new FormControl('', [Validators.required]);
        this.filteredPatients = this.patient.valueChanges
            .startWith(null)
            .map((patient: Patient) => patient && typeof patient === 'object' ? this.announcePatient(patient) : patient)
            .map(val => val ? this.filterPatients(val) : this.patients.slice());

        this.clinic = new FormControl('', [Validators.required]);
        this.status = new FormControl('', [Validators.required]);
        this.clinic.valueChanges.subscribe(clinic => {
            this.getOthers(clinic);
        });

        this.provider = new FormControl();
        this.filteredProviders = this.provider.valueChanges
            .startWith(null)
            .map((provider: Employee) => provider && typeof provider === 'object' ? provider.employeeDetails.lastName : provider)
            .map(val => val ? this.filterProviders(val) : this.providers.slice());

        this.type = new FormControl('', [Validators.required]);
        // this.filteredAppointmentTypes = this.type.valueChanges
        //     .startWith(null)
        //     .map((type: AppointmentType) => type && typeof type === 'object' ? type.name : type)
        //     .map(val => val ? this.filterAppointmentTypes(val) : this.appointmentTypes.slice());

        this.category = new FormControl('', [Validators.required]);
        this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
        this.auth = <any>this.locker.getObject('auth');
        this.primeComponent();

        if (this.selectedClinic._id !== undefined) {
            this.appointmentService.clinicAnnounced({ clinicId: this.selectedClinic, startDate: this.date });
        }
    }

    addToast(msg: string) {
        const toastOptions: ToastOptions = {
            title: 'Apmis',
            msg: msg,
            showClose: true,
            timeout: 5000,
            theme: 'default',
            onAdd: (toast: ToastData) => {
                console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: function (toast: ToastData) {
                console.log('Toast ' + toast.id + ' has been removed!');
            }
        };

        this.toastyService.info(toastOptions);
    }

    ngOnInit() {
        this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
        this.employeeService.loginEmployeeAnnounced$.subscribe(employee => {
            this.loginEmployee = employee;
            this.primeComponent();
        })
        this.patientService.patientAnnounced$.subscribe(value => {
            this.selectedPatient = value;
            console.log(this.selectedPatient);
            this.patient.setValue(this.selectedPatient);
        })
        this.getPatients();

    }
    primeComponent() {
        const majorLocation$ = Observable.fromPromise(this.locationService.find({ query: { name: 'Clinic' } }));
        const appointmentTypes$ = Observable.fromPromise(this.appointmentTypeService.findAll());
        // const patient$ = Observable.fromPromise(this.patientService.find({ query: { facilityId: this.selectedFacility._id } }));
        const schedule$ = Observable.fromPromise(this.scheduleService.find({ query: { facilityId: this.selectedFacility._id } }));
        const professions$ = Observable.fromPromise(this.professionService.findAll());
        const facilityServiceCategory$ = Observable.fromPromise(this.facilityServiceCategoryService
            .find({ query: { facilityId: this.selectedFacility._id } }));
        const workSpaces$ = Observable.fromPromise(this.workSpaceService.find({ query: { 'employeeId._id': this.loginEmployee._id } }));
        const orderStatuses$ = Observable.fromPromise(this.orderStatusService.findAll());
        Observable
            .forkJoin([majorLocation$, appointmentTypes$, professions$, facilityServiceCategory$, workSpaces$, schedule$, orderStatuses$])
            .subscribe((results: any) => {
                results[0].data.forEach((itemi, i) => {
                    if (itemi.name === 'Clinic') {
                        this.clinicMajorLocation = itemi;
                    }
                });
                this.appointmentTypes = results[1].data;
                const schedules = results[5].data;
                this.professions = results[2].data;
                if (results[4].data.length > 0) {
                    const categories = results[3].data[0].categories;
                    const filterCategories = categories.filter(x => x.name === 'Appointment');
                    if (filterCategories.length > 0) {
                        this.categoryServices = filterCategories[0].services;
                    }
                    if (this.appointment._id !== undefined) {
                        this.category.setValue(this.appointment.category);
                    }
                }
                this.orderStatuses = results[6].data;
                this.orderStatuses.forEach((item) => {
                    if (item.name === 'Scheduled') {
                        this.status.setValue(item);
                    }
                })
                if (this.loginEmployee.professionObject.name === 'Doctor') {
                    this.selectedProfession = this.professions.filter(x => x._id === this.loginEmployee.professionId)[0];
                    this.isDoctor = true;
                } else {
                    this.isDoctor = false;
                }
                if (this.appointment._id !== undefined) {
                    this.patient.setValue(this.appointment.patientId);
                }
                this.scheduleManagers = schedules;
                this.getEmployees();
                this.getClinics()
            })
    }
    isAppointmentToday() {
        Observable.fromPromise(this.appointmentService
            .find({ query: { _id: this.appointment._id, isAppointmentToday: true } })
            .subscribe(payload => {
                if (payload.data.length > 0) {
                    this.canCheckIn = true;
                    this.checkIn.enable();
                } else {
                    this.canCheckIn = false;
                    this.checkIn.disable();
                }
            }))
    }
    announcePatient(value) {
        this.appointmentService.patientAnnounced(value);
        return value.personDetails.lastName;
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
        const clinicIds = [];
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
                                clinicIds.push(clinicModel._id);
                            }
                        });
                    } else if (this.loginEmployee !== undefined && this.loginEmployee.professionObject.name !== 'Doctor') {
                        this.loginEmployee.workSpaces.forEach((wrk, ii) => {
                            wrk.locations.forEach((lct, li) => {
                                this.scheduleManagers.forEach((sch: any, ji) => {
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

        this.clinics.forEach((itemc, c) => {
            const filteredManangers = this.scheduleManagers.filter(x => x.clinicObject.clinic._id === itemc._id);
            if (filteredManangers.length > 0) {
                itemc.schedules = filteredManangers[0].schedules;
            }
        });
        if (this.appointment._id !== undefined) {
            const filterClinics = this.clinics.filter(x => x._id === this.appointment.clinicId._id);
            if (filterClinics.length > 0) {
                this.clinic.setValue(filterClinics[0]);
            }

        }
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
                    if (itemu === items.clinicObject.unit._id) {
                        const res = inClinicLocations.filter(x => x._id === items.clinicObject.clinic.clinicLocation);
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
        this.loadingPatients = true;
        this.patientService.find({ query: { facilityId: this.selectedFacility._id } })
            .subscribe(payload => {
                this.patients = payload.data;
                this.loadingPatients = false;
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
        this.loadingProviders = true;
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
                    });
                    if (this.appointment._id !== undefined) {
                        this.provider.setValue(this.appointment.doctorId);
                    }
                    this.loadingProviders = false;
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
                    if (this.appointment._id !== undefined) {
                        this.provider.setValue(this.appointment.doctorId);
                    }
                    this.loadingProviders = false;

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
        return provider ? provider.employeeDetails.lastName + ' ' + provider.employeeDetails.firstName : provider;
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

    orderStatusDisplayFn(order: any) {
        return order ? order.name : order;
    }

    scheduleAppointment() {
        if (this.dateCtrl.valid && this.patient.valid && this.type.valid && this.category.valid && this.clinic.valid) {
            this.loadIndicatorVisible = true;
            const patient = this.patient.value;
            const clinic = this.clinic.value;
            const provider = this.provider.value;
            const type = this.type.value;
            const category = this.category.value;
            const orderStatus = this.status.value;
            const checkIn = this.checkIn.value;
            const date = this.date;
            const reason = this.reason.value;
            const facility = this.locker.getObject('miniFacility');

            delete patient.appointments;
            delete patient.encounterRecords;
            delete patient.orders;
            delete patient.tags;
            delete patient.personDetails.addressObj;
            delete patient.personDetails.countryItem;
            delete patient.personDetails.homeAddress;
            delete patient.personDetails.maritalStatus;
            delete patient.personDetails.nationality;
            delete patient.personDetails.nationalityObject;
            delete patient.personDetails.nextOfKin;

            if (provider !== null) {
                delete provider.department;
                delete provider.employeeFacilityDetails;
                delete provider.role;
                delete provider.units;
                delete provider.employeeDetails.countryItem;
                delete provider.employeeDetails.homeAddress;
                delete provider.employeeDetails.gender;
                delete provider.employeeDetails.maritalStatus;
                delete provider.employeeDetails.nationality;
                delete provider.employeeDetails.nationalityObject;
                delete provider.employeeDetails.nextOfKin;
            }

            this.appointment.appointmentReason = reason;
            this.appointment.appointmentTypeId = type;
            this.appointment.clinicId = clinic.clinic;
            this.appointment.doctorId = provider;
            this.appointment.facilityId = <any>facility;
            this.appointment.patientId = patient;
            this.appointment.startDate = this.date;
            if (checkIn === true) {
                const logEmp: any = this.loginEmployee;
                delete logEmp.department;
                delete logEmp.employeeFacilityDetails;
                delete logEmp.role;
                delete logEmp.units;
                delete logEmp.consultingRoomCheckIn;
                delete logEmp.storeCheckIn;
                delete logEmp.unitDetails;
                delete logEmp.professionObject;
                delete logEmp.employeeDetails.countryItem;
                delete logEmp.employeeDetails.homeAddress;
                delete logEmp.employeeDetails.gender;
                delete logEmp.employeeDetails.maritalStatus;
                delete logEmp.employeeDetails.nationality;
                delete logEmp.employeeDetails.nationalityObject;
                delete logEmp.employeeDetails.nextOfKin;
                this.appointment.attendance = {
                    employeeId: logEmp,
                    dateCheckIn: new Date()
                };
            }
            this.appointment.category = category;
            this.appointment.orderStatusId = orderStatus;
            if (this.appointment._id !== undefined) {
                this.appointmentService.update(this.appointment).then(payload => {
                    let topic = "Appointment with " + patient.personDetails.apmisId;
                    this.appointmentService.setMeeting(topic, this.appointment.startDate, this.appointment._id).then(meeting => {
                        console.log(meeting)
                        this.appointmentService.patientAnnounced(this.patient);
                        this.loadIndicatorVisible = false;
                        this.newSchedule();
                        this.appointmentService.clinicAnnounced({ clinicId: this.selectedClinic, startDate: this.date });
                        this.addToast('Appointment updated successfully');
                    })
                    // this.appointmentService.patientAnnounced(this.patient);
                    // this.loadIndicatorVisible = false;
                    // this.newSchedule();
                    // this.appointmentService.clinicAnnounced({ clinicId: this.selectedClinic, startDate: this.date });
                    // this.addToast('Appointment updated successfully');
                }, error => {
                    this.loadIndicatorVisible = false;
                })
            } else {
                this.appointmentService.create(this.appointment).then(payload => {
                    this.appointmentService.patientAnnounced(this.patient);
                    this.loadIndicatorVisible = false;
                    this.newSchedule();
                    this.appointmentService.clinicAnnounced({ clinicId: this.selectedClinic, startDate: this.date });
                    this.addToast('Appointment scheduled successfully');
                }, error => {
                    this.loadIndicatorVisible = false;
                })
            }
        } else {
            console.log('error');
        }


    }
    getOthers(clinic: any) {
        this.schedules = [];
        if (clinic !== null) {
            this.selectedClinic = clinic;
            if (clinic.schedules !== undefined) {
                clinic.schedules.forEach((itemi, i) => {
                    this.schedules.push(itemi);
                });
            }
            this.appointmentService.schedulesAnnounced(this.schedules);



            const dayNum = getDay(this.date);
            const day = this.days[dayNum];
            const scheduleFiltered = this.schedules.filter((x: any) => x.day === day);
            if (scheduleFiltered.length === 0) {
                this.dateCtrl.setErrors({ noValue: true });
                this.dateCtrl.markAsTouched();
                this.checkIn.disable();
                this.checkIn.setValue(false);
            } else {
                const schedule: any = scheduleFiltered[0];
                this.date = setHours(this.date, getHours(schedule.startTime));
                this.date = setMinutes(this.date, getMinutes(schedule.startTime));
                this.startDate = setHours(this.startDate, getHours(schedule.startTime));
                this.startDate = setMinutes(this.startDate, getMinutes(schedule.startTime));
                // this.endDate = setHours(this.endDate, getHours(schedule.endTime));
                // this.endDate = setMinutes(this.endDate, getMinutes(schedule.endTime));
                // this.dateCtrl.setValue(this.date);
                this.checkIn.enable();
                this.dateCtrl.setErrors(null)//({ noValue: false });
                this.dateCtrl.markAsUntouched();
            }
            if (this.selectedClinic._id !== undefined) {
                this.appointmentService.clinicAnnounced({ clinicId: clinic, startDate: this.date });
            }

        }
    }
    dateChange(event) {
        const dayNum = getDay(event);
        const day = this.days[dayNum];
        const scheduleFiltered = this.schedules.filter((x: any) => x.day === day);
        if (scheduleFiltered.length === 0) {
            this.dateCtrl.setErrors({ noValue: true });
            this.dateCtrl.markAsTouched();
            this.date = event;
            this.startDate = event;
            this.endDate = event;
            // this.dateCtrl.setValue(this.date);
            this.checkIn.disable();
            this.checkIn.setValue(false);
            this.startDate = setHours(this.startDate, getHours(this.startDate));
            this.startDate = setMinutes(this.startDate, getMinutes(this.startDate));
        } else {
            this.date = event;
            const schedule: any = scheduleFiltered[0];
            // this.date = setHours(this.date, getHours(schedule.startTime));
            // this.date = setMinutes(this.date, getMinutes(schedule.startTime));
            this.startDate = setHours(this.startDate, getHours(schedule.startTime));
            this.startDate = setMinutes(this.startDate, getMinutes(schedule.startTime));
            // this.endDate = setHours(this.endDate, getHours(schedule.endTime));
            // this.endDate = setMinutes(this.endDate, getMinutes(schedule.endTime));
            // this.dateCtrl.setValue(this.date);
            this.checkIn.enable();
            this.dateCtrl.setErrors(null)//({ noValue: false });
            this.dateCtrl.markAsUntouched();
            console.log(this.date);
            console.log(this.dateCtrl.value)
        }
        if (this.selectedClinic._id !== undefined) {
            this.appointmentService.clinicAnnounced({ clinicId: this.selectedClinic, startDate: this.date });
        }
    }
    newSchedule() {
        this.patient.reset();
        this.clinic.reset();
        this.provider.reset();
        this.type.reset();
        this.category.reset();
        this.checkIn.reset();
        this.date = new Date();
        this.reason.reset();
        this.status.reset();
    }

    clickMe() {
    }

}
