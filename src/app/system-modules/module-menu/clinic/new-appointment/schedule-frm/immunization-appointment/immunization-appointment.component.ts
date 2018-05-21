import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import {
  Facility,
  Employee,
  ClinicModel,
  AppointmentType,
  Appointment,
  Profession,
  Patient,
  ScheduleRecordModel,
  MinorLocation
} from '../../../../../../models/index';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {
  FacilitiesService,
  SchedulerService,
  AppointmentService,
  AppointmentTypeService,
  ProfessionService,
  EmployeeService,
  WorkSpaceService,
  PatientService,
  FacilitiesServiceCategoryService,
  TimezoneService,
  SmsAlertService,
  FacilityPriceService,
  BillingService
} from '../../../../../../services/facility-manager/setup/index';
import {
  LocationService,
  OrderStatusService
} from '../../../../../../services/module-manager/setup/index';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as getDay from 'date-fns/get_day';
import * as setDay from 'date-fns/set_day';
import * as getHours from 'date-fns/get_hours';
import * as setHours from 'date-fns/set_hours';

import * as setMinutes from 'date-fns/set_minutes';
import * as getMinutes from 'date-fns/get_minutes';
import * as getYear from 'date-fns/get_year';
import * as setYear from 'date-fns/set_year';
import * as getMonth from 'date-fns/get_month';
import * as setMonth from 'date-fns/set_month';
import * as isToday from 'date-fns/is_today';
import * as parse from 'date-fns/parse';
import * as isBefore from 'date-fns/is_before';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&�*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-immunization-appointment',
  templateUrl: './immunization-appointment.component.html',
  styleUrls: ['./immunization-appointment.component.scss']
})
export class ImmunizationAppointmentComponent implements OnInit {
  appointmentIsToday = false;
  showTimeZone: boolean;
  @Input() selectedPatient: any;
  selectedProvider: any;
  mainErr = true;
  errMsg = 'You have unresolved errors';
  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  selectedProfession: Profession = <Profession>{};
  clinics: any[] = [];
  patients: Patient[] = [];
  clinicLocations: MinorLocation[] = [];

  filteredClinics: Observable<any[]>;
  filteredProviders: Observable<Employee[]>;
  filteredAppointmentTypes: Observable<AppointmentType[]>;
  filteredPatients: Observable<Patient[]>;
  filteredCategoryServices: Observable<any[]>;

  appointmentTypes: AppointmentType[] = [];
  providers: Employee[] = [];
  schedules: ScheduleRecordModel[] = [];
  scheduleManagers: ScheduleRecordModel[] = [];
  professions: Profession[] = [];
  categoryServices: any[] = [];
  timezones: any[] = [];
  appointments: any[] = [];
  orderStatuses: any[] = [];
  selectedClinic: any = <any>{};
  selectedClinicSchedule: any;
  isDoctor = false;
  loadIndicatorVisible = false;
  loadingPatients = false;
  loadingProviders = false;
  canCheckIn = true;
  subscription: Subscription;
  auth: any;
  currentDate: Date = new Date();
  clinicMajorLocation: any;
  organizationalServiceId: any = {};
  organizationalServicePrice = 0;
  // filteredStates: any;
  patient: FormControl;
  clinic: FormControl;
  provider: FormControl;
  type: FormControl;
  status: FormControl;
  serviceCategory: FormControl;
  category: FormControl;
  checkIn: FormControl;
  teleMed: FormControl;
  timezone: FormControl;
  date = new Date(); // FormControl = new FormControl();
  endDate = new Date();
  startDate = new Date();
  dateCtrl: FormControl = new FormControl(new Date(), [Validators.required]);
  reason: FormControl = new FormControl();
  appointment: any = <any>{};
  apmisLookupUrl = 'patient-search';
  apmisLookupText = '';
  apmisLookupQuery: any = {};
  apmisLookupDisplayKey = 'personDetails.firstName';
  apmisLookupImgKey = 'personDetails.profileImageObject.thumbnail';
  apmisLookupOtherKeys = ['personDetails.lastName', 'personDetails.firstName', 'personDetails.apmisId', 'personDetails.email'];
  apmisProviderLookupUrl = 'employee-search';
  apmisProviderLookupText = '';
  apmisProviderLookupQuery: any = {};
  apmisProviderLookupDisplayKey = 'personDetails.firstName';
  apmisProviderLookupImgKey = 'personDetails.profileImageObject.thumbnail';
  apmisProviderLookupOtherKeys = ['personDetails.lastName', 'personDetails.firstName', 'personDetails.apmisId', 'personDetails.email'];

  days: any[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  selectedAppointment: Appointment = <Appointment>{};
  btnText = 'Schedule Appointment';
  disableBtn = false;
  saveAppointment = true;
  savingAppointment = false;
  updateAppointment = false;
  clinicErrorMsg = ' Clinic does not hold on the selected date!!!';
  clinicErrorEalierDateMsg = ' Clinic can not be set for earlier date!!!';
  isEarlierDate = false;

  user = {};
  placeholderString = 'Select timezone';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locker: CoolLocalStorage,
    private scheduleService: SchedulerService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private appointmentTypeService: AppointmentTypeService,
    private professionService: ProfessionService,
    private employeeService: EmployeeService,
    private workSpaceService: WorkSpaceService,
    private timeZoneService: TimezoneService,
    private orderStatusService: OrderStatusService,
    private systemModuleService: SystemModuleService,
    private authFacadeService: AuthFacadeService,
    private locationService: LocationService,
    private facilityServiceCategoryService: FacilitiesServiceCategoryService,
    private facilityPriceService: FacilityPriceService,
    private _smsAlertService: SmsAlertService,
    private billingService: BillingService,
  ) {
    appointmentService.appointmentAnnounced$.subscribe((payload: any) => {
      this.appointment = payload;
      this.updateAppointment = true;
      this.saveAppointment = false;
      this.savingAppointment = false;
      const filterClinic = this.clinics.filter(
        x => x._id === payload.clinicId._id
      );
      if (filterClinic.length > 0) {
        this.clinic.setValue(filterClinic[0]);
        this.dateChange(this.appointment.startDate);
      }

      // this.provider.setValue(payload.providerDetails);
      if (this.appointment.providerDetails !== undefined) {
        this.apmisProviderLookupHandleSelectedItem(this.appointment.providerDetails);
      }
      this.selectedPatient = payload.patientDetails;

      //this.patient.setValue(payload.patientDetails);
      this.apmisLookupHandleSelectedItem(payload.patientDetails);
      this.date = payload.startDate;
      this.reason.setValue(payload.appointmentReason);

      this.type.setValue(payload.appointmentTypeId);

      this.category.setValue(payload.category);
      this.status.setValue(payload.orderStatusId);
      if (payload.attendance !== undefined) {
        if (this.canCheckIn) {
          this.checkIn.enable();
        } else {
          this.checkIn.disable();
        }
      } else {
        this.checkIn.disable();
      }
      if (payload.zoom !== undefined) {
        this.teleMed.setValue(true);
        this.timezone.setValue(payload.zoom.timezone);
      }
      this.isAppointmentToday();
    });
    this.dateCtrl.valueChanges.subscribe(value => {
      this.dateChange(value);
    });
    this.checkIn = new FormControl({ value: false, disabled: this.canCheckIn });
    this.teleMed = new FormControl();

    this.patient = new FormControl('', [Validators.required]);
    this.patient.valueChanges.subscribe(value => {
      this.apmisLookupQuery = {
        facilityId: this.selectedFacility._id,
        searchText: value,
        'patientTable': true,
      };
    });
    // this.filteredPatients = this.patient.valueChanges
    //   .startWith(null)
    //   .map(
    //     (patient: Patient) =>
    //       patient && typeof patient === "object"
    //         ? this.announcePatient(patient)
    //         : patient
    //   )
    //   .map(val => (val ? this.filterPatients(val) : this.patients.slice()));

    this.clinic = new FormControl('', [Validators.required]);
    this.status = new FormControl('', [Validators.required]);
    this.clinic.valueChanges.subscribe(clinic => {
      this.getOthers(clinic);
    });

    this.provider = new FormControl();
    this.provider.valueChanges.subscribe(value => {
      this.apmisProviderLookupQuery = {
        facilityId: this.selectedFacility._id,
        searchText: value,
        'employeeTable': true,
      };
    });
    // this.filteredProviders = this.provider.valueChanges
    //   .startWith(null)
    //   .map(
    //     (provider: Employee) =>
    //       provider && typeof provider === "object"
    //         ? provider.personDetails.lastName
    //         : provider
    //   )
    //   .map(val => (val ? this.filterProviders(val) : this.providers.slice()));

    this.type = new FormControl('', [Validators.required]);

    // this.filteredAppointmentTypes = this.type.valueChanges
    //     .startWith(null)
    //     .map((type: AppointmentType) => type && typeof type === 'object' ? type.name : type)
    //     .map(val => val ? this.filterAppointmentTypes(val) : this.appointmentTypes.slice());

    this.category = new FormControl('', [Validators.required]);
    this.timezone = new FormControl('', []);
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.auth = this.authFacadeService.getAuth(); // <any>this.locker.getObject("auth");

    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      this.primeComponent();
    });

    if (this.selectedClinic._id !== undefined) {
      this.appointmentService.clinicAnnounced({
        clinicId: this.selectedClinic,
        startDate: this.date
      });
    }
    this.teleMed.valueChanges.subscribe(value => {
      if (value) {
        this.showTimeZone = true;
      } else {
        this.showTimeZone = false;
      }
    });
  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.auth = <any>this.locker.getObject('auth');
    this.employeeService.loginEmployeeAnnounced$.subscribe(employee => {
      this.loginEmployee = employee;
    });
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
          // this.getLoginEmployee();
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
          if (
            this.loginEmployee !== undefined &&
            this.loginEmployee.professionId === 'Doctor'
          ) {
            this.loginEmployee.units.forEach((itemu, u) => {
              if (itemu === itemj.name) {
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
          } else if (
            this.loginEmployee !== undefined &&
            this.loginEmployee.professionId !== 'Doctor'
          ) {
            this.loginEmployee.workSpaces.forEach((wrk, ii) => {
              wrk.locations.forEach((lct, li) => {
                this.scheduleManagers.forEach((sch: any, ji) => {
                  sch.schedules.forEach((sch2, jji) => {
                    if (
                      sch2.location._id === lct.minorLocationId &&
                      sch.clinic === itemk.clinicName
                    ) {
                      if (clinicIds.filter(x => x === itemk._id).length === 0) {
                        const clinicModel: ClinicModel = <ClinicModel>{};
                        clinicModel.clinic = sch.clinic;
                        clinicModel.department = itemi;
                        clinicModel.unit = itemj;
                        clinicModel._id = itemk._id;
                        clinicModel.clinicName = itemk.clinicName;
                        this.clinics.push(clinicModel);
                        clinicIds.push(clinicModel._id);
                      }
                    }
                  });
                });
              });
            });
          }
        });
      });
    });

    this.clinics.forEach((itemc, c) => {
      const filteredManangers = this.scheduleManagers.filter(
        x => x.clinic === itemc.name
      );
      if (filteredManangers.length > 0) {
        itemc.schedules = filteredManangers[0].schedules;
      }
    });
    if (this.appointment._id !== undefined) {
      const filterClinics = this.clinics.filter(
        x => x._id === this.appointment.clinicId._id
      );
      if (filterClinics.length > 0) {
        this.clinic.setValue(filterClinics[0]);
      }
    }
    this.loadIndicatorVisible = false;
  }

  getClinicLocation() {
    this.clinicLocations = [];
    const inClinicLocations: MinorLocation[] = [];
    const minors = this.selectedFacility.minorLocations.filter(
      x => x.locationId === this.clinicMajorLocation._id
    );
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
    if (
      this.loginEmployee.professionId !== undefined &&
      this.loginEmployee.professionId === 'Doctor'
    ) {
      this.schedules.forEach((items, s) => {
        this.loginEmployee.units.forEach((itemu, u) => {
          if (itemu === items.unit) {
            // const res = inClinicLocations.filter(x => x._id === items.clinicObject.clinic.clinicLocation);
            // if (res.length > 0) {
            //     this.clinicLocations.push(res[0]);
            // }
          }
        });
      });
    } else {
      this.loginEmployee.workSpaces.forEach((itemw, w) => {
        itemw.locations.forEach((iteml, l) => {
          const res = inClinicLocations.filter(
            x => x._id === iteml.minorLocationId
          );
          if (res.length > 0) {
            this.clinicLocations.push(res[0]);
          }
        });
      });
    }
  }

  getSchedules() {
    this.scheduleService
      .find({ query: { facilityId: this.selectedFacility._id } })
      .subscribe(payload => { });
  }

  getPatients() {
    this.loadingPatients = true;
    this.patientService
      .find({ query: { facilityId: this.selectedFacility._id } })
      .subscribe(payload => {
        this.patients = payload.data;
        this.loadingPatients = false;
      });
  }

  getEmployees() {
    this.loadingProviders = true;
    this.providers = [];
    if (this.isDoctor) {
      this.employeeService
        .find({
          query: {
            facilityId: this.selectedFacility._id,
            professionId: this.selectedProfession,
            units: { $in: this.loginEmployee.units }
          }
        })
        .then(payload => {
          payload.data.forEach((itemi, i) => {
            this.providers.push(itemi);
          });
          if (this.appointment._id !== undefined) {
            // this.provider.setValue(this.appointment.providerDetails);
            if (this.appointment.providerDetails !== undefined) {
              this.apmisProviderLookupHandleSelectedItem(this.appointment.providerDetails);
            }
          }
          this.loadingProviders = false;
        });
    } else {
      this.employeeService
        .find({
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
            // this.provider.setValue(this.appointment.providerDetails);
            if (this.appointment.providerDetails !== undefined) {
              this.apmisProviderLookupHandleSelectedItem(this.appointment.providerDetails);
            }
          }
          this.loadingProviders = false;
        });
    }
  }

  getAppointmentTypes() {
    this.appointmentTypeService.findAll().subscribe(payload => {
      this.appointmentTypes = payload.data;
    });
  }

  filterClinics(val: any) {
    return val
      ? this.clinics.filter(
        s => s.clinicName.toLowerCase().indexOf(val.toLowerCase()) === 0
      )
      : this.clinics;
  }

  filterPatients(val: any) {
    return val
      ? this.patients.filter(
        s =>
          s.personDetails.lastName
            .toLowerCase()
            .indexOf(val.toLowerCase()) === 0 ||
          s.personDetails.firstName
            .toLowerCase()
            .indexOf(val.toLowerCase()) === 0
      )
      : this.patients;
  }

  filterProviders(val: any) {
    return val
      ? this.providers.filter(
        s =>
          s.personDetails.lastName
            .toLowerCase()
            .indexOf(val.toLowerCase()) === 0 ||
          s.personDetails.firstName
            .toLowerCase()
            .indexOf(val.toLowerCase()) === 0
      )
      : this.providers;
  }
  filterAppointmentTypes(val: any) {
    return val
      ? this.appointmentTypes.filter(
        s => s.name.toLowerCase().indexOf(val.toLowerCase()) === 0
      )
      : this.appointmentTypes;
  }
  filterCategoryServices(val: any) {
    return val
      ? this.categoryServices.filter(
        s => s.name.toLowerCase().indexOf(val.toLowerCase()) === 0
      )
      : this.categoryServices;
  }
  displayFn(clinic: any): string {
    return clinic ? clinic.clinicName : clinic;
  }
  providerDisplayFn(provider: any): string {
    return provider
      ? provider.personDetails.lastName + ' ' + provider.personDetails.firstName
      : provider;
  }

  appointmentTypeDisplayFn(type: any): string {
    return type ? type.name : type;
  }
  patientDisplayFn(patient: any) {
    return patient
      ? patient.personDetails.lastName + ' ' + patient.personDetails.firstName
      : patient;
  }

  categoryServiceDisplayFn(category: any) {
    return category ? category.name : category;
  }

  timezoneDisplayFn(timezone: any) {
    return timezone ? timezone.name : timezone;
  }

  orderStatusDisplayFn(order: any) {
    return order ? order.name : order;
  }

  scheduleAppointment(){
    
  }

  primeComponent() {
    const majorLocation$ = Observable.fromPromise(
      this.locationService.find({ query: { name: 'Clinic' } })
    );
    const appointmentTypes$ = Observable.fromPromise(
      this.appointmentTypeService.findAll()
    );
    // const patient$ = Observable.fromPromise(this.patientService.find({ query: { facilityId: this.selectedFacility._id } }));
    const schedule$ = Observable.fromPromise(
      this.scheduleService.find({
        query: { facilityId: this.selectedFacility._id, scheduleType: 'Clinic' }
      })
    );
    const professions$ = Observable.fromPromise(
      this.professionService.findAll()
    );
    const facilityServiceCategory$ = Observable.fromPromise(
      this.facilityServiceCategoryService.find({
        query: { facilityId: this.selectedFacility._id }
      })
    );
    const workSpaces$ = Observable.fromPromise(
      this.workSpaceService.find({
        query: { employeeId: this.loginEmployee._id }
      })
    );
    const orderStatuses$ = Observable.fromPromise(
      this.orderStatusService.findAll()
    );
    Observable.forkJoin([
      majorLocation$,
      appointmentTypes$,
      professions$,
      facilityServiceCategory$,
      workSpaces$,
      schedule$,
      orderStatuses$
    ]).subscribe(
      (results: any) => {
        results[0].data.forEach((itemi, i) => {
          if (itemi.name === 'Clinic') {
            this.clinicMajorLocation = itemi;
          }
        });
        this.appointmentTypes = results[1].data;
        const schedules = results[5].data;
        this.professions = results[2].data;
        if (results[4].data.length > 0) {
        }

        const categories = results[3].data[0].categories;
        this.organizationalServiceId.facilityServiceId = results[3].data[0]._id;
        const filterCategories = categories.filter(
          x => x.name === 'Appointment'
        );
        if (filterCategories.length > 0) {
          this.categoryServices = filterCategories[0].services;
          this.organizationalServiceId.categoryId = filterCategories[0]._id;
        }
        if (this.appointment._id !== undefined) {
          this.category.setValue(this.appointment.category);
        }
        this.orderStatuses = results[6].data;
        this.orderStatuses.forEach(item => {
          if (item.name === 'Scheduled') {
            this.status.setValue(item);
          }
        });
        if (this.loginEmployee.professionId === 'Doctor') {
          this.selectedProfession = this.professions.filter(
            x => x._id === this.loginEmployee.professionId
          )[0];
          this.isDoctor = true;
        } else {
          this.isDoctor = false;
        }
        if (this.appointment._id !== undefined) {
          // this.patient.setValue(this.appointment.patientDetails);
          this.apmisLookupHandleSelectedItem(this.selectedPatient);
        }
        this.scheduleManagers = schedules;
        this.getEmployees();
        this.getClinics();
        this.validateCurrentAppointment();
      },
      error => {
      }
    );
  }

  validateCurrentAppointment() {
    if (this.appointment !== undefined) {
      const appTypeIndex = this.appointmentTypes.findIndex(
        x => x.name === this.appointment.appointmentTypeId
      );
      if (appTypeIndex > -1) {
        this.type.setValue(this.appointmentTypes[appTypeIndex]);
      }

      const statusIndex = this.orderStatuses.findIndex(
        x => x.name === this.appointment.orderStausId
      );
      if (statusIndex > -1) {
        this.status.setValue(this.orderStatuses[statusIndex]);
      }

      const categoryIndex = this.categoryServices.findIndex(
        x => x.name === this.appointment.category
      );
      if (categoryIndex > -1) {
        this.category.setValue(this.categoryServices[categoryIndex]);
      }

      const clinicIndex = this.clinics.findIndex(
        x => x.clinicName === this.appointment.clinicId
      );
      if (clinicIndex > -1) {
        this.clinic.setValue(this.clinics[clinicIndex]);
        this.dateChange(this.appointment.startDate);
      }
    }
  }

  dateChange(event) {
    this.authFacadeService.getServerTime().then((serverTime: any) => {
      var serverDate = new Date(serverTime.datetime);
      var localDate = new Date(event);
      const scheduleStartHour = getHours(this.selectedClinicSchedule.startTime);
      const scheduleEndHour = getHours(this.selectedClinicSchedule.endTime);
      const currentHour = getHours(localDate);

      if (((isBefore(serverDate, localDate)) && ((scheduleStartHour < currentHour) && (scheduleEndHour > currentHour))) || this.appointment._id !== undefined) {
        this.isEarlierDate = false;
        const dayNum = getDay(event);
        const day = this.days[dayNum];
        const scheduleFiltered = this.schedules.filter((x: any) => x.day === day);
        if (scheduleFiltered.length === 0) {
          this.dateCtrl.setErrors({ noValue: true });
          this.dateCtrl.markAsTouched();
          this.date = event;
          this.startDate = event;
          this.endDate = event;
          this.checkIn.disable();
          this.checkIn.setValue(false);
          this.startDate = setHours(this.startDate, getHours(this.startDate));
          this.startDate = setMinutes(this.startDate, getMinutes(this.startDate));
        } else {
          this.date = event;
          const schedule: any = scheduleFiltered[0];
          this.startDate = setHours(this.startDate, getHours(schedule.startTime));
          this.startDate = setMinutes(
            this.startDate,
            getMinutes(schedule.startTime)
          );
          this.canCheckIn = isToday(this.date)

          if (this.canCheckIn) {
            this.checkIn.enable();
          } else {
            this.checkIn.disable();
          }
          this.dateCtrl.setErrors(null); // ({ noValue: false });
          this.dateCtrl.markAsUntouched();
        }
        if (this.selectedClinic._id !== undefined) {
          this.appointmentService.clinicAnnounced({
            clinicId: this.selectedClinic,
            startDate: this.date
          });
        }
      } else {
        this.dateCtrl.setErrors({ noValue: true });
        this.isEarlierDate = true;
        this.dateCtrl.markAsTouched();
      }
    }).catch(er => {
    })
  }

  getOthers(clinic: any) {
    this.schedules = [];
    if (clinic !== null) {
      this.selectedClinic = clinic;
      this.scheduleManagers.forEach(manager => {
        if (manager.clinic === clinic.clinicName) {
          this.schedules = this.schedules.concat(manager.schedules);
        }
      });
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
        const scheduleStartHour = getHours(schedule.startTime);
        const scheduleEndHour = getHours(schedule.endTime);
        const currentHour = getHours(new Date());
        if (this.appointment._id === undefined) {
          //comment by me starday
          // this.date = setHours(this.date, getHours(schedule.startTime));
          // this.date = setMinutes(this.date, getMinutes(schedule.startTime));
          // this.startDate = setHours(this.startDate, getHours(schedule.startTime));
          // this.startDate = setMinutes(
          //   this.startDate,
          //   getMinutes(schedule.startTime)
          // );
          //end comment

          //start new code here





          if (((scheduleStartHour < currentHour) && (scheduleEndHour > currentHour))) {
            this.date = new Date();
            this.date = setHours(this.date, getHours(new Date()));
            this.date = setMinutes(this.date, getMinutes(new Date()));
            this.startDate = setHours(this.startDate, getHours(new Date()));
            this.startDate = setMinutes(
              this.startDate,
              getMinutes(new Date())
            );
          }
          //end new code here
          if (this.canCheckIn) {
            this.checkIn.enable();
          } else {
            this.checkIn.disable();
          }
          this.dateCtrl.setErrors(null); // ({ noValue: false });
          this.dateCtrl.markAsUntouched();
          this.selectedClinicSchedule = schedule;
        } else {
          if (((scheduleStartHour > currentHour) || (scheduleEndHour < currentHour))) {
            this.dateCtrl.setErrors({ noValue: true });
            this.dateCtrl.markAsTouched();
            this.checkIn.disable();
            this.checkIn.setValue(false);
          } else {
            this.date = setHours(this.date, getHours(schedule.startTime));
            this.date = setMinutes(this.date, getMinutes(schedule.startTime));
            this.startDate = setHours(this.startDate, getHours(schedule.startTime));
            this.startDate = setMinutes(
              this.startDate,
              getMinutes(schedule.startTime)
            );
            if (this.canCheckIn) {
              this.checkIn.enable();
            } else {
              this.checkIn.disable();
            }
            this.dateCtrl.setErrors(null); // ({ noValue: false });
            this.dateCtrl.markAsUntouched();
            this.selectedClinicSchedule = schedule;
          }
        }


      }
      if (this.selectedClinic._id !== undefined) {
        this.appointmentService.clinicAnnounced({
          clinicId: clinic,
          startDate: this.date
        });
      }
    }
  }

  isAppointmentToday() {
    Observable.fromPromise(
      this.appointmentService
        .findAppointment({
          query: { _id: this.appointment._id, isAppointmentToday: true }
        })
        .subscribe(payload => {
          if (payload.data.length > 0) {
            this.canCheckIn = true;
            this.checkIn.enable();
            this.appointmentIsToday = true;
          } else {
            this.canCheckIn = false;
            this.checkIn.disable();
            this.appointmentIsToday = false;
          }
        }, error => {
        })
    );
  }

  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = `${value.personDetails.firstName} ${value.personDetails.lastName}`;
    this.selectedPatient = value;
    this.appointmentService.patientAnnounced(this.selectedPatient);
  }

  apmisProviderLookupHandleSelectedItem(value) {
    this.apmisProviderLookupText = `${value.personDetails.firstName} ${value.personDetails.lastName}`;
    this.selectedProvider = value;
  }

}
