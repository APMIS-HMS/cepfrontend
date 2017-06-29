import { Component, ViewChild, OnInit } from '@angular/core';
import { Service, doctRes, clinicRes, locationRes, consultRoomRes } from '../../../../services/facility-manager/setup/devexpress.service';
import Query from 'devextreme/data/query';
import notify from 'devextreme/ui/notify';
import { DxSchedulerComponent } from 'devextreme-angular';
import {
    ClinicModel, Profession, Appointment, AppointmentType, Schedule, Employee, Patient, Facility, Location, MinorLocation,
    ScheduleRecordModel
} from '../../../../models/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import {
    EmployeeService, FacilitiesService, AppointmentTypeService, ProfessionService, PatientService, SchedulerService,
    SchedulerTypeService, AppointmentService, WorkSpaceService
} from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {

    @ViewChild(DxSchedulerComponent) scheduler: DxSchedulerComponent;
    @ViewChild('switch') switch: any;
    @ViewChild('filterClinic') filterClinic: any;
    @ViewChild('filterLocation') filterLocation: any;
    @ViewChild('filterDoctor') filterDoctor: any;
    @ViewChild('filterUnit') filterUnit: any;

    currentDate: Date = new Date();
    appointmentData: Appointment[];
    doctResData: doctRes[];
    consultRoomResData: consultRoomRes[];
    clinicResData: clinicRes[] = [];

    dataSource: any;
    clinicArray: any[];
    level1id: string;
    level2id: string;
    level1datasrc: string;
    level2datasrc: string;

    clinics: any[] = [];
    clinicLocations: MinorLocation[] = [];
    minorLocations: any[] = [];
    employees: Employee[] = [];
    patients: Patient[] = [];
    schedules: any[] = [];
    scheduleManagers: ScheduleRecordModel[] = [];
    professions: Profession[] = [];
    appointmentTypes: AppointmentType[] = [];
    selectedAppointmentType: AppointmentType = <AppointmentType>{};
    selectedProfession: Profession = <Profession>{};
    selectedFacility: Facility = <Facility>{};
    clinic: Location = <Location>{};
    loginEmployee: Employee = <Employee>{};
    selectedSchedulerType: any = <any>{};
    selectedDoctor: string = <string>{};
    selectedDoctorId = '';
    filtered = false;
    disabledWidget = false;
    isDoctor = false;
    workSpace: any = <any>{};

    newScheduleStartDate;
    newScheduleEndDate;
    loadIndicatorVisible = false;

    constructor(private service: Service, private locker: CoolLocalStorage,
        private locationService: LocationService,
        private employeeService: EmployeeService,
        public facilityService: FacilitiesService,
        private schedulerService: SchedulerService,
        private professionService: ProfessionService,
        private appointmentTypeService: AppointmentTypeService,
        private schedulerTypeService: SchedulerTypeService,
        private appointmentService: AppointmentService,
        private workSpaceService: WorkSpaceService,
        private route: ActivatedRoute,
        private router: Router,
        private patientService: PatientService) {
        this.route.data.subscribe(data => {
        });
    }
    ngOnInit() {
        this.switch.valueChange.subscribe(payload => {
            if (payload === true) {

            } else {
                this.filterLocation.value = undefined;
                this.filterClinic.value = undefined;
                this.filterDoctor.value = undefined;
                this.filterUnit.value = undefined;
                this.selectedDoctor = '';
                this.reloadAppointments();
            }
        });
        this.appointmentService.createlistner.subscribe(payload => {
            this.reloadAppointments();
        });
        this.appointmentService.updatelistner.subscribe(payload => {
            this.reloadAppointments();
        });
        this.appointmentService.deletedlistner.subscribe(payload => {
            this.reloadAppointments();
        });

        this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
        const auth: any = this.locker.getObject('auth');

        const emp$ = Observable.fromPromise(this.employeeService.find({
            query: {
                facilityId: this.selectedFacility._id, personId: auth.data.personId, showbasicinfo: true
            }
        }));

        const profession$ = Observable.fromPromise(this.professionService.findAll());
        const appointmentType$ = Observable.fromPromise(this.appointmentTypeService.findAll());
        const patient$ = Observable.fromPromise(this.patientService.find({ query: { facilityId: this.selectedFacility._id } }));
        const majorLocation$ = Observable.fromPromise(this.locationService.find({ query: { name: 'Clinic' } }));
        const schedules$ = Observable.fromPromise(this.schedulerService.find({ query: { facilityId: this.selectedFacility._id } }));

        emp$.mergeMap((emp: any) => Observable.forkJoin([Observable.fromPromise(this.employeeService.get(emp.data[0]._id, {})),
            profession$, appointmentType$, patient$, majorLocation$, schedules$]))
            .subscribe((results: any) => {
                console.log(results);
                if (results[0] !== undefined) {
                    this.loginEmployee = results[0];
                }
                this.professions = results[1].data;
                if (this.loginEmployee.professionObject.name === 'Doctor') {
                    this.selectedProfession = this.professions.filter(x => x._id === this.loginEmployee.professionId)[0];
                    this.isDoctor = true;
                } else {
                    this.isDoctor = false;
                }
                this.appointmentTypes = results[2].data;
                this.patients = results[3].data;
                const clinics = results[4].data;
                if (clinics.length > 0) {
                    this.clinic = clinics[0];
                }



                this.clinics = [];
                this.clinicResData = [];
                this.selectedFacility.departments.forEach((itemi, i) => {
                    itemi.units.forEach((itemj, j) => {
                        itemj.clinics.forEach((itemk, k) => {
                            const clinicModel: ClinicModel = <ClinicModel>{};
                            clinicModel.clinic = itemk;
                            clinicModel.department = itemi;
                            clinicModel.unit = itemj;
                            clinicModel._id = itemk._id;
                            clinicModel.clinicName = itemk.clinicName;
                            this.clinics.push(clinicModel);

                            const model: clinicRes = <clinicRes>{};
                            model.id = clinicModel._id;
                            model.cliniclocation = '';
                            model.text = itemk.clinicName;
                            model.unitid = itemj._id;
                            this.clinicResData.push(model);
                        });
                    });
                });

                const schedules = results[5].data;

                this.scheduleManagers = schedules;
                console.log(this.scheduleManagers);

                this.clinics.forEach((itemc, c) => {
                    const filteredManangers = this.scheduleManagers.filter(x => x.locationType.clinic._id === itemc._id);
                    if (filteredManangers.length > 0) {
                        itemc.schedules = filteredManangers[0].schedules;
                        // itemc.schedules.forEach((itemi, i) => {
                        //     // this.schedules.push(itemi);
                        // });
                    }
                });









                this.workSpaceService.find({
                    query:
                    { employeeId: this.loginEmployee._id }
                }).then((payload: any) => {
                    this.workSpace = payload.data[0];
                    this.reloadAppointments();
                    this.populateLocationLists();
                });
            });

        // Observable.fromPromise(this.employeeService.find({
        //     query: {
        //         facilityId: this.selectedFacility._id, personId: auth.data.personId
        //     }
        // })).mergeMap((empValud: any) => this.workSpaceService.find({
        //     query:
        //     { employeeId: empValud.data[0]._id }
        // })).subscribe((payload: any) => {
        //     console.log(payload);
        //     this.workSpace = payload.data[0];
        //     this.loginEmployee = payload.data[0].employeeObject;
        //     if (this.loginEmployee.professionObject.name === 'Doctor') {
        //         this.selectedProfession = this.professions.filter(x => x._id === this.loginEmployee.professionId)[0];
        //         this.isDoctor = true;
        //     } else { this.isDoctor = false; }

        //     this.primeComponent();
        // });


        // this.route.data.subscribe((data: any) => {
        //     console.log(data);
        //     data['loginEmployeeWorkSpace'].subscribe((payload) => {
        //         console.log(payload);
        //         if (payload.workSpaces.length > 0) {
        //             this.workSpace = payload.workSpaces[0];
        //         }
        //         if (payload.loginEmployee !== undefined) {
        //             this.loginEmployee = payload.loginEmployee;
        //             if (this.loginEmployee.professionObject.name === 'Doctor') {
        //                 this.selectedProfession = this.professions.filter(x => x._id === this.loginEmployee.professionId)[0];
        //                 this.isDoctor = true;
        //             } else { this.isDoctor = false; }

        //             this.primeComponent();
        //         }
        //     }, error => {
        //         console.log(error);
        //     });
        // });

    }
    primeComponent() {
        const profession = Observable.fromPromise(this.professionService.findAll());
        const appointmentType = Observable.fromPromise(this.appointmentTypeService.findAll());
        const scheduleType = Observable.fromPromise(this.schedulerTypeService.find({ query: { name: 'Clinic' } }));

        Observable.forkJoin([profession, appointmentType, scheduleType]).subscribe((results: any) => {
            this.professions = results[0].data;
            if (this.loginEmployee.professionObject.name === 'Doctor') {
                this.selectedProfession = this.professions.filter(x => x._id === this.loginEmployee.professionId)[0];
                this.isDoctor = true;
            } else {
                this.isDoctor = false;
            }
            this.reloadAppointments();
            this.appointmentTypes = results[1].data;
            const schdulerTypes = results[2].data;
            if (schdulerTypes.length > 0) {
                this.selectedSchedulerType = schdulerTypes[0];
            }
        });

    }
    isCheckedIn(data): boolean {
        const appointmentData: Appointment = data.appointmentData;
        if ((appointmentData.attendance !== undefined) && appointmentData.attendance !== null
            && appointmentData.attendance._id !== undefined) {
            return true;
        }
        return false;
    }
    getAppointmentTypes() {
        this.appointmentTypeService.findAll().then(payload => {
            this.appointmentTypes = payload.data;
            if (this.appointmentTypes.length > 0) {
                this.selectedAppointmentType = this.appointmentTypes[0];
            }
        });
    }
    getProfessions() {
        this.professionService.findAll().then(payload => {
            payload.data.forEach((itemi, i) => {
                this.professions.push(itemi);
            });
        });
    }
    reloadAppointments() {
        this.doctResData = [];
        // this.getClinics();
        // this.getClinicMajorLocation();
        // this.getEmployees();
        // this.getPatients();

        // this.getSchedulerType();
    }
    getClinicSchedules() {
        this.clinics.forEach((itemc, c) => {
            this.schedulerService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
                this.scheduleManagers = payload.data;
                console.log(this.scheduleManagers);
                const filteredManangers = this.scheduleManagers.filter(x => x.locationType.clinic._id === itemc._id);
                if (filteredManangers.length > 0) {
                    itemc.schedules = filteredManangers[0].schedules;
                    itemc.schedules.forEach((itemi, i) => {
                        // this.schedules.push(itemi);
                    });
                }
            }, error => {
                console.log(error);
            });
        });
    }

    getSchedulerType() {
        this.schedulerTypeService.findAll().then(payload => {
            payload.data.forEach((itemi, i) => {
                if (itemi.name === 'Clinic') {
                    this.selectedSchedulerType = itemi;
                }
            });
        });
    }
    getPatients() {
        console.log(this.selectedFacility._id)
        this.patientService.find({ query: { facilityId: this.selectedFacility._id } })
            .then(payload => {
                this.patients = payload.data;
            }, error => {
                console.log(error)
            });
    }
    getEmployees() {
        this.doctResData = [];
        this.employees = [];
        if (this.selectedProfession !== undefined) {
            if (this.isDoctor) {

                this.employeeService.find({
                    query: {
                        facilityId: this.selectedFacility._id,
                        professionId: this.selectedProfession._id, units: { $in: this.loginEmployee.units }
                    }
                })
                    .then(payload => {
                        console.log('about almost');
                        payload.data.forEach((itemi, i) => {
                            const doc: doctRes = <doctRes>{};
                            doc.id = itemi._id;
                            doc.text = itemi.employeeDetails.personFullName;
                            this.doctResData.push(doc);
                            this.employees.push(itemi);
                            if (this.loginEmployee._id !== undefined && this.selectedProfession._id !== undefined) {
                                this.doctResData = this.doctResData.filter(x => x.id === this.loginEmployee._id);
                            }

                        });
                        const unAssinged: Employee = <Employee>{ employeeDetails: { title: {} } };
                        unAssinged.employeeDetails.firstName = '';
                        unAssinged.employeeDetails.lastName = 'Unassigned';
                        unAssinged.employeeDetails.title.name = '';
                        unAssinged.employeeDetails.personFullName = 'Unassigned';
                        unAssinged._id = '';
                        this.employees.push(unAssinged);
                        const doc2: doctRes = <doctRes>{};
                        doc2.id = '';
                        doc2.text = unAssinged.employeeDetails.personFullName;
                        this.doctResData.push(doc2);
                        this.clinicArray = ['locationId', 'clinicId', 'doctorId'];
                        console.log('almost 1')
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
                            const doc: doctRes = <doctRes>{};
                            doc.id = itemi._id;
                            doc.text = itemi.employeeDetails.personFullName;
                            this.doctResData.push(doc);
                            this.employees.push(itemi);
                            if (this.loginEmployee._id !== undefined && this.selectedProfession._id !== undefined) {
                                this.doctResData = this.doctResData.filter(x => x.id === this.loginEmployee._id);
                            }

                        });
                        const unAssinged: Employee = <Employee>{ employeeDetails: { title: {} } };
                        unAssinged.employeeDetails.firstName = '';
                        unAssinged.employeeDetails.lastName = 'Unassigned';
                        unAssinged.employeeDetails.title.name = '';
                        unAssinged.employeeDetails.personFullName = 'Unassigned';
                        unAssinged._id = '';
                        this.employees.push(unAssinged);
                        const doc2: doctRes = <doctRes>{};
                        doc2.id = '';
                        doc2.text = unAssinged.employeeDetails.personFullName;
                        this.doctResData.push(doc2);
                        this.clinicArray = ['locationId', 'clinicId', 'doctorId'];
                        console.log('almost')
                    }, error => {
                        console.log(error);
                    });
            }
        }
    }
    getClinics() {
        this.clinics = [];
        this.clinicResData = [];
        this.selectedFacility.departments.forEach((itemi, i) => {
            itemi.units.forEach((itemj, j) => {
                itemj.clinics.forEach((itemk, k) => {
                    const clinicModel: ClinicModel = <ClinicModel>{};
                    clinicModel.clinic = itemk;
                    clinicModel.department = itemi;
                    clinicModel.unit = itemj;
                    clinicModel._id = itemk._id;
                    clinicModel.clinicName = itemk.clinicName;
                    this.clinics.push(clinicModel);

                    const model: clinicRes = <clinicRes>{};
                    model.id = clinicModel._id;
                    model.cliniclocation = '';
                    model.text = itemk.clinicName;
                    model.unitid = itemj._id;
                    this.clinicResData.push(model);
                });
            });
        });
        this.getClinicSchedules();
    }
    getClinicMajorLocation() {
        this.locationService.findAll().then(payload => {
            payload.data.forEach((itemi, i) => {
                if (itemi.name === 'Clinic') {
                    this.clinic = itemi;
                    // this.getClinicLocation();
                }
            });
        });
    }
    populateLocationLists() {
        this.clinicLocations = [];
        this.minorLocations = [];
        const minors = this.selectedFacility.minorLocations.filter(x => x.locationId === this.clinic._id);
        minors.forEach((itemi, i) => {
            const minorLocation: MinorLocation = <MinorLocation>{};
            minorLocation._id = itemi._id;
            minorLocation.description = itemi.description;
            minorLocation.locationId = itemi.locationId;
            minorLocation.name = itemi.name;
            minorLocation.shortName = itemi.shortName;
            minorLocation.text = itemi.name;

            const me: locationRes = <locationRes>{};
            me.id = minorLocation._id;
            me.text = minorLocation.text;
            this.minorLocations.push(me);
            this.clinicLocations.push(minorLocation);

        });


        let employee$;
        if (this.isDoctor) {

            employee$ = Observable.fromPromise(this.employeeService.find({
                query: {
                    facilityId: this.selectedFacility._id,
                    professionId: this.selectedProfession._id, units: { $in: this.loginEmployee.units }
                }
            }));
        } else {

            employee$ = Observable.fromPromise(this.employeeService.find({
                query: {
                    facilityId: this.selectedFacility._id,
                    professionId: this.selectedProfession._id
                }
            }));
        }


        const workspace = this.workSpace;
        if (workspace !== undefined && this.selectedProfession._id !== undefined) {
            const locationList: string[] = [];
            workspace.locations.forEach((loc, i) => {
                locationList.push(loc.minorLocationId);
            });
            const inMinorLocations: any[] = [];
            this.minorLocations.forEach((inMin, im) => {
                const mFiltered = locationList.filter(x => x === inMin.id);
                if (mFiltered.length > 0) {
                    inMinorLocations.push(inMin);
                }
            });
            this.minorLocations = inMinorLocations;
            console.log('about to load app data');

            // call appointment service
            const appointment$ = Observable.fromPromise(this.appointmentService.find({
                query: {
                    facilityId:
                    this.selectedFacility._id, doctorId: this.loginEmployee._id,
                    locationId: { $in: locationList }
                }
            }));
            this.getClinicLocation(locationList, appointment$, employee$);
        } else {
            const locationList: string[] = [];
            if (workspace !== undefined) {
                workspace.locations.forEach((loc, i) => {
                    locationList.push(loc.minorLocationId);
                });
                const inMinorLocations: any[] = [];
                this.minorLocations.forEach((inMin, im) => {
                    const mFiltered = locationList.filter(x => x === inMin.id);
                    if (mFiltered.length > 0) {
                        inMinorLocations.push(inMin);
                    }
                });
                this.minorLocations = inMinorLocations;

                // call appointment service 2
                const appointment$ = Observable.fromPromise(this.appointmentService.find({
                    query: {
                        facilityId:
                        this.selectedFacility._id,
                        locationId: { $in: locationList }
                    }
                }));
                this.getClinicLocation(locationList, appointment$, employee$);
            } else {
                this.minorLocations = [];
                // call appointment service 3
                const appointment$ = Observable.fromPromise(this.appointmentService.find({
                    query: {
                        facilityId:
                        this.selectedFacility._id,
                        locationId: { $in: locationList }
                    }
                }));
                this.getClinicLocation(locationList, appointment$, employee$);
            }
        }
    }
    getClinicLocation(locationsList: any, appointment$, employee$: any) {
        this.loadIndicatorVisible = true;
        Observable.forkJoin([appointment$, employee$]).subscribe((results: any) => {
            this.appointmentData = results[0].data;
            console.log(this.appointmentData);

            const employees = results[1].data;
            if (this.isDoctor) {
                employees.forEach((itemi, i) => {
                    const doc: doctRes = <doctRes>{};
                    doc.id = itemi._id;
                    doc.text = itemi.employeeDetails.personFullName;
                    this.doctResData.push(doc);
                    this.employees.push(itemi);
                    if (this.loginEmployee._id !== undefined && this.selectedProfession._id !== undefined) {
                        this.doctResData = this.doctResData.filter(x => x.id === this.loginEmployee._id);
                    }

                });
                const unAssinged: Employee = <Employee>{ employeeDetails: { title: {} } };
                unAssinged.employeeDetails.firstName = '';
                unAssinged.employeeDetails.lastName = 'Unassigned';
                unAssinged.employeeDetails.title.name = '';
                unAssinged.employeeDetails.personFullName = 'Unassigned';
                unAssinged._id = '';
                this.employees.push(unAssinged);
                const doc2: doctRes = <doctRes>{};
                doc2.id = '';
                doc2.text = unAssinged.employeeDetails.personFullName;
                this.doctResData.push(doc2);
                this.clinicArray = ['locationId', 'clinicId', 'doctorId'];
                this.loadIndicatorVisible = false;
            } else {
                employees.forEach((itemi, i) => {
                    const doc: doctRes = <doctRes>{};
                    doc.id = itemi._id;
                    doc.text = itemi.employeeDetails.personFullName;
                    this.doctResData.push(doc);
                    this.employees.push(itemi);
                    if (this.loginEmployee._id !== undefined && this.selectedProfession._id !== undefined) {
                        this.doctResData = this.doctResData.filter(x => x.id === this.loginEmployee._id);
                    }

                });
                const unAssinged: Employee = <Employee>{ employeeDetails: { title: {} } };
                unAssinged.employeeDetails.firstName = '';
                unAssinged.employeeDetails.lastName = 'Unassigned';
                unAssinged.employeeDetails.title.name = '';
                unAssinged.employeeDetails.personFullName = 'Unassigned';
                unAssinged._id = '';
                this.employees.push(unAssinged);
                const doc2: doctRes = <doctRes>{};
                doc2.id = '';
                doc2.text = unAssinged.employeeDetails.personFullName;
                this.doctResData.push(doc2);
                this.clinicArray = ['locationId', 'clinicId', 'doctorId'];
                this.loadIndicatorVisible = false;
            }

        });
    }
    filterMinorLocationByMinorLocation(minorLocationId: string) {
        this.minorLocations = [];
        const minors = this.selectedFacility.minorLocations.filter(x => x.locationId === this.clinic._id);
        minors.forEach((itemi, i) => {
            if (itemi._id === minorLocationId) {
                const minor: locationRes = <locationRes>{};
                minor.id = itemi._id;
                minor.text = itemi.name;
                this.minorLocations.push(minor);
            }
        });
        this.clinicArray = ['locationId', 'clinicId', 'doctorId'];
    }
    filterClinicDateByClinic(clinicId: string) {
        this.clinicResData = [];
        this.selectedFacility.departments.forEach((itemi, i) => {
            itemi.units.forEach((itemj, j) => {
                itemj.clinics.forEach((itemk, k) => {
                    if (itemk._id === clinicId) {
                        const model: clinicRes = <clinicRes>{};
                        model.id = itemk._id;
                        model.text = itemk.clinicName;
                        model.unitid = itemj._id;
                        this.clinicResData.push(model);
                    }
                });
            });
        });
        this.clinicArray = ['locationId', 'clinicId', 'doctorId'];
    }
    filterDoctorByDoctor(doctorId: string) {
        this.doctResData = [];
        if (doctorId.length > 0) {
            this.employeeService.find({
                query: {
                    facilityId: this.selectedFacility._id, professionId: this.selectedProfession._id,
                    _id: doctorId
                }
            })
                .then(payload => {
                    payload.data.forEach((itemi, i) => {
                        const doc: doctRes = <doctRes>{};
                        doc.id = itemi._id;
                        doc.text = itemi.employeeDetails.personFullName;
                        this.doctResData.push(doc);
                    });
                    this.clinicArray = ['locationId', 'clinicId', 'doctorId'];
                });
        } else {
            this.doctResData = this.doctResData.filter(x => x.id === '');
            this.clinicArray = ['locationId', 'clinicId', 'doctorId'];
        }

    }
    onCellClick($event) {
        this.schedules = [];
        const filteredManangers = this.scheduleManagers.filter(x => x.locationType.clinic._id === $event.cellData.groups.clinicId
            && x.locationType.clinic.clinicLocation === $event.cellData.groups.locationId);
        if (filteredManangers.length === 0) {
            $event.cancel = true;
            notify({
                message: 'Clinic does not hold on this day and time',
                type: 'error',
                displayTime: 3000,
                closeOnClick: true,
                closeOnSwipe: true,
                closeOnOutsideClick: true,
            });
        }
    }
    onAppointmentUpdated(data) {
        const appointment: Appointment = data.appointmentData;
        if (appointment.checkin === true && (appointment.attendance === undefined || appointment.attendance._id === undefined)) {
            const auth: any = this.locker.getObject('auth');
            const authData: any = auth.data;
            const personId = authData.personId;
            this.employeeService.find({ query: { personId: personId, facilityId: this.selectedFacility._id } })
                .then((emp) => {
                    if (emp.data.length > 0) {
                        if (appointment.attendance === undefined) {
                            appointment.attendance = {};
                        }
                        appointment.attendance.employeeId = emp.data[0]._id;
                        appointment.attendance.dateCheckIn = new Date();
                        this.appointmentService.patch(appointment._id, appointment, {}).then(payload => {
                            // this.reloadAppointments();
                            this.ngOnInit();
                        }, error => {
                            console.log(error);
                        });
                    }
                });
        } else if (appointment.checkin === false && appointment.attendance !== undefined && appointment.attendance._id !== undefined) {
            appointment.attendance = null;
            this.appointmentService.update(appointment).then(payload => {
                this.reloadAppointments();
                this.ngOnInit();
            }, error => {
                console.log(error);
            });
        }
    }
    onAppointmentAdded(data) {
        const appointment: Appointment = <Appointment>{};
        appointment.allDay = data.allDay;
        appointment.appointmentReason = data.appointmentData.reason;
        appointment.appointmentTypeId = data.appointmentData.appointmentTypeId;
        appointment.clinicId = data.appointmentData.clinicId;
        appointment.doctorId = data.appointmentData.doctorId;
        appointment.endDate = data.appointmentData.endDate;
        appointment.facilityId = this.selectedFacility._id;
        appointment.locationId = data.appointmentData.locationId;
        appointment.patientId = data.appointmentData.patientId;
        appointment.scheduleId = data.appointmentData.scheduleId;
        appointment.startDate = data.appointmentData.startDate;

        this.appointmentService.create(appointment).then(payload => {
        },
            error => {
                this.reloadAppointments();
            });
    }
    onAppointmentFormDoubleClick(data) {
        this.selectedDoctorId = data.appointmentData.doctorId;
    }

    onAppointmentFormCreated(data) {
        this.selectedDoctorId = data.appointmentData.doctorId;
        const appointmentData: Appointment = data.appointmentData;
        if ((appointmentData.attendance !== undefined) && appointmentData.attendance !== null
            && appointmentData.attendance._id !== undefined) {
            this.disabledWidget = true;
        } else {
            this.disabledWidget = false;
        }

        this.schedules = [];
        const filteredManangers = this.scheduleManagers.filter(x => x.locationType.clinic._id === data.appointmentData.clinicId
            && x.locationType.clinic.clinicLocation === data.appointmentData.locationId);
        if (filteredManangers.length > 0) {
            const selectedManager = filteredManangers[0];
            selectedManager.schedules.forEach((itemi, i) => {
                const sch: Schedule = <Schedule>{};
                sch._id = itemi._id;
                sch.day = itemi.day;
                sch.endTime = itemi.endTime;
                sch.startTime = itemi.startTime;
                sch.location = itemi.location;
                sch.text = itemi.day + ' ' + itemi.location.name;
                this.schedules.push(sch);
            });
            const scheduleStartDate = new Date(this.schedules[0].startTime);
            const scheduleEndDate = new Date(this.schedules[0].endTime);

            const appointmentStartDate: Date = new Date(data.appointmentData.startDate);
            const appointmentEndDate: Date = new Date(data.appointmentData.endDate);

            this.newScheduleStartDate = new Date(appointmentStartDate.getFullYear(), appointmentStartDate.getMonth(),
                appointmentStartDate.getDate(), scheduleStartDate.getHours(), scheduleStartDate.getMinutes());

            this.newScheduleEndDate = new Date(appointmentEndDate.getFullYear(), appointmentEndDate.getMonth(),
                appointmentEndDate.getDate(), scheduleEndDate.getHours(), scheduleEndDate.getMinutes());


        }

        // tslint:disable-next-line:prefer-const
        let that = this, form = data.form, movieInfo = that.getMovieById(data.appointmentData._appointmentid) || {},
            startDate = data.appointmentData.startDate;

        form.option('items', [
            {
                label: {
                    text:
                    'Select Clinic Schedule'
                },
                editorType: 'dxLookup',
                dataField: 'scheduleId',
                editorOptions: {
                    items: that.schedules,
                    displayExpr: 'text',
                    valueExpr: '_id',
                    disabled: that.disabledWidget
                },
                validationRules: [{
                    type: 'required',
                    message: 'Clinic schedule is required for an appointment.'
                }]
            },
            {
                label: {
                    text:
                    'Select Patient'
                },
                editorType: 'dxLookup',
                dataField: 'patientId',
                editorOptions: {
                    items: that.patients,
                    displayExpr: 'personDetails.personFullName',
                    valueExpr: '_id',
                    disabled: that.disabledWidget
                },
                validationRules: [{
                    type: 'required',
                    message: 'Patient is required for an appointment.'
                }]
            },
            {
                label: {
                    text: 'Doctor to see'
                },
                editorType: 'dxLookup',
                dataField: 'doctorId',
                editorOptions: {
                    items: that.employees,
                    displayExpr: 'employeeDetails.personFullName',
                    valueExpr: '_id',
                    value: this.selectedDoctorId,
                    disabled: that.disabledWidget
                }
            }, {
                label: {
                    text: 'Type of Appointment'
                },
                editorType: 'dxSelectBox',
                dataField: 'appointmentTypeId',
                editorOptions: {
                    items: that.appointmentTypes,
                    displayExpr: 'name',
                    valueExpr: '_id',
                    value: that.selectedAppointmentType._id,
                    disabled: that.disabledWidget
                },
                validationRules: [{
                    type: 'required',
                    message: 'Appointment type is required for an appointment.'
                }]
            }, {
                dataField: 'startDate',
                editorType: 'dxDateBox',
                editorOptions: {
                    type: 'time',
                    value: data.appointmentData.startDate,
                    min: that.newScheduleStartDate,
                    max: that.newScheduleEndDate,
                    dateOutOfRangeMessage: 'Apmis: Time is out of range',
                    disabled: that.disabledWidget,
                    onValueChanged: function (args) {
                        startDate = args.value;
                    }
                },
                validationRules: [
                    { type: 'required' },
                    {
                        type: 'range', min: that.newScheduleStartDate, max: that.newScheduleEndDate,
                        message: 'Sorry, Time is out of range.'
                    }
                ]
            }, {
                name: 'End Date',
                dataField: 'endDate',
                editorType: 'dxDateBox',
                editorOptions: {
                    type: 'time',
                    value: data.appointmentData.endDate,
                    min: that.newScheduleStartDate,
                    max: that.newScheduleEndDate,
                    dateOutOfRangeMessage: 'Apmis: Time is out of range',
                    readOnly: false,
                    disabled: that.disabledWidget
                },
                validationRules: [
                    { type: 'required' },
                    {
                        type: 'range', min: that.newScheduleStartDate, max: that.newScheduleEndDate,
                        message: 'Sorry, Time is out of range.'
                    }
                ]
            }, {
                label: {
                    text: 'Reason for Appointment',
                },
                editorType: 'dxTextArea',
                dataField: 'reason',
                editorOptions: {
                    disabled: that.disabledWidget
                }
            }, {
                label: {
                    text: 'Check-In Patient'
                },
                editorType: 'dxCheckBox',
                dataField: 'checkin',
                editorOptions: {
                    value: that.isCheckedIn(data),
                    disabled: that.disabledWidget
                }
            }]);
    }

    editDetails(showtime) {
        this.scheduler.instance.showAppointmentPopup(this.getDataObj(showtime), false);
    }

    getDataObj(objData) {
        for (let i = 0; i < this.appointmentData.length; i++) {
            this.appointmentData[i].startDate = new Date(this.appointmentData[i].startDate);
            this.appointmentData[i].endDate = new Date(this.appointmentData[i].endDate);
            if (this.appointmentData[i].startDate.getTime() === objData.startDate.getTime()
                && this.appointmentData[i].clinicId === objData.clinicId) {
                return this.appointmentData[i];
            }

        }
        return null;
    }

    getMovieById(id) {
        return Query(this.appointmentData).toArray()[0];
    }
    getdocById(id) {
        return Query(this.doctResData).filter(id).toArray()[0];
    }

    onValueChanged(event: any) {
        const minorLocationId = this.filterLocation.value;
        if (minorLocationId === undefined || minorLocationId === null) {
            this.appointmentService.find({ query: { clinicId: event.value } }).then(payload => {
                this.appointmentData = payload.data;
            });
            this.filterClinicDateByClinic(event.value);
        } else {
            this.appointmentService.find({ query: { clinicId: event.value, locationId: minorLocationId } }).then(payload => {
                this.appointmentData = payload.data;
            });
            this.filterClinicDateByClinic(event.value);
        }

        this.switch.value = true;
        this.clinicArray = ['locationId', 'clinicId', 'doctorId'];
    }
    onFilterAppointment() {
        this.filtered = !this.filtered;
    }
    onLocationValueChanged(event: any) {
        const clinicId = this.filterClinic.value;
        if (clinicId === undefined || clinicId === null) {
            this.appointmentService.find({ query: { locationId: event.value } }).then(payload => {
                this.appointmentData = payload.data;
            });

            this.filterMinorLocationByMinorLocation(event.value);
        } else {
            this.appointmentService.find({ query: { locationId: event.value, clinicId: clinicId } }).then(payload => {
                this.appointmentData = payload.data;
            });
            this.filterMinorLocationByMinorLocation(event.value);
        }

        this.switch.value = true;
        this.clinicArray = ['locationId', 'clinicId', 'doctorId'];
    }

    onUnitValueChanged(event: any) {
        const clinicId = this.filterClinic.value;
        const locationId = this.filterLocation.value;

        const employeeIds: string[] = [];
        this.employeeService.find({
            query: {
                units: event.value,
            }
        }).then(payloade => {
            payloade.data.forEach((iteme, e) => {
                employeeIds.push(iteme._id);
            });




            if (clinicId === undefined || clinicId === null) {
                this.appointmentService.find({ query: { doctorId: { $in: employeeIds } } }).then(payload => {
                    this.appointmentData = payload.data;
                    this.doctResData = [];
                    payloade.data.forEach((itemi, i) => {
                        const doc: doctRes = <doctRes>{};
                        doc.id = itemi._id;
                        doc.text = itemi.employeeDetails.personFullName;
                        this.doctResData.push(doc);
                    });
                    this.clinicArray = ['locationId', 'clinicId', 'doctorId'];




                });
            } else {
                this.appointmentService.find({ query: { locationId: event.value, clinicId: clinicId } }).then(payload => {
                    this.appointmentData = payload.data;
                });
                this.filterMinorLocationByMinorLocation(event.value);
            }
            this.switch.value = true;
            this.clinicArray = ['locationId', 'clinicId', 'doctorId'];
        });
    }

    onDoctorValueChanged(event: any) {
        if (event !== undefined && event.value !== undefined && event.value.length > 0) {
            this.selectedDoctor = event.value;
            this.selectedDoctorId = event.value;
            const clinicId = this.filterClinic.value;
            const locationId = this.filterLocation.value;
            if (clinicId === undefined || clinicId === null) {
                if (locationId === undefined || locationId === null) {
                    this.appointmentService.find({ query: { doctorId: event.value } }).then(payload => {
                        this.appointmentData = payload.data;
                    });
                    this.filterDoctorByDoctor(event.value);
                } else {
                    this.appointmentService.find({ query: { doctorId: event.value, locationId: locationId } }).then(payload => {
                        this.appointmentData = payload.data;
                    });
                    this.filterDoctorByDoctor(event.value);
                }

            } else {
                if (locationId === undefined || locationId === null) {
                    this.appointmentService.find({ query: { doctorId: event.value, clinicId: clinicId } }).then(payload => {
                        this.appointmentData = payload.data;
                    });
                    this.filterDoctorByDoctor(event.value);
                } else {
                    this.appointmentService.find({
                        query: {
                            doctorId: event.value, clinicId: clinicId,
                            locationId: locationId
                        }
                    }).then(payload => {
                        this.appointmentData = payload.data;
                    });
                    this.filterDoctorByDoctor(event.value);
                }
            }

            this.switch.value = true;
            this.clinicArray = ['locationId', 'clinicId', 'doctorId'];
        } else {
            this.filterDoctorByDoctor('');
        }
    }
}
