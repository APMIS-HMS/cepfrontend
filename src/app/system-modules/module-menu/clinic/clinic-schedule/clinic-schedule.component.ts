import { Component, OnInit } from '@angular/core';
import { SchedulerService, SchedulerTypeService } from '../../../../services/facility-manager/setup/index';
import { ClinicModel, Facility, Location, ScheduleRecordModel } from '../../../../models/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-clinic-schedule',
  templateUrl: './clinic-schedule.component.html',
  styleUrls: ['./clinic-schedule.component.scss']
})
export class ClinicScheduleComponent implements OnInit {

  value: Date = new Date(1981, 3, 27);
  now: Date = new Date();
  min: Date = new Date(1900, 0, 1);
  dateClear = new Date(2015, 11, 1, 6);

  clinicScheduleForm: FormGroup;
  locationTypeControl = new FormControl();
  clinic: Location = <Location>{};
  selectedFacility: Facility = <Facility>{};
  selectedSchedulerType: any = <any>{};
  selectedManager: ScheduleRecordModel = <ScheduleRecordModel>{};
  clinics: any[] = [];
  clinicLocations: any[] = [];
  schedules: any[] = [];
  scheduleManagers: ScheduleRecordModel[] = [];

  days: any[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(private formBuilder: FormBuilder,
    private locationService: LocationService,
    private locker: CoolLocalStorage,
    private schedulerTypeService: SchedulerTypeService,
    private schedulerService: SchedulerService) {
  }
  ngOnInit() {
    this.subscribToFormControls();
    this.getClinicMajorLocation();
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
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
        });
      });
    });
    this.getSchedulerType();
    this.addNewClinicSchedule();
    this.getClinicSchedules();
  }
  getClinicSchedules() {
    this.clearAllSchedules();
    this.schedulerService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.scheduleManagers = payload.data;
    });
  }
  subscribToFormControls() {
    this.locationTypeControl.valueChanges.subscribe(value => {
      this.clearAllSchedules();
      this.schedulerService.find({ query: { 'clinicObject._id': value._id.toString() } }).then(payload => {
        if (payload.data.length > 0) {
          this.selectedManager = payload.data[0];
          this.loadManagerSchedules(false);
        }
      });
    });
  }
  onSelectSchedulerManager(manager: ScheduleRecordModel) {
    this.selectedManager = manager;
    this.locationTypeControl.setValue(this.clinics.filter(x => x._id === this.selectedManager.clinicObject._id)[0]);
    this.loadManagerSchedules(false);
  }
  loadManagerSchedules(force: boolean) {
    this.clearAllSchedules();
    if (this.selectedManager !== undefined && this.selectedManager.clinicObject !== undefined && force === false) {
      this.selectedManager.schedules.forEach((itemi, i) => {
        const d = new Date(itemi.startTime);
        const hour = d.getHours();
        const min = d.getMinutes();
        const time = { hour: hour, minute: min };

        const d2 = new Date(itemi.endTime);
        const ehour = d2.getHours();
        const emin = d2.getMinutes();
        const etime = { hour: ehour, minute: emin };
        (<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray']).push(
          this.formBuilder.group({
            day: [itemi.day, [<any>Validators.required]],
            startTime: [time, [<any>Validators.required]],
            endTime: [etime, [<any>Validators.required]],
            location: [this.clinicLocations.filter(x => x._id === itemi.location._id)[0], [<any>Validators.required]],
            readOnly: [true]
          })
        );

      });
    } else {
      this.getClinicSchedules();
    }

  }
  get formData() {
    return <FormArray>this.clinicScheduleForm.controls['clinicScheduleArray'].get('Data');
  }
  clearAllSchedules() {
    this.clinicScheduleForm.controls['clinicScheduleArray'] = this.formBuilder.array([]);
  }
  getClinicMajorLocation() {
    this.locationService.findAll().then(payload => {
      payload.data.forEach((itemi, i) => {
        if (itemi.name === 'Clinic') {
          this.clinic = itemi;
          this.getClinicLocation();
        }
      });
    });
  }
  getSchedulerType() {
    this.schedulerTypeService.findAll().then(res => {
      console.log(res);
      if (res.data.length > 0) {
        this.selectedSchedulerType = res.data[0];
      }
    }).catch(err => console.log(err));
  }
  getClinicLocation() {
    this.clinicLocations = this.selectedFacility.minorLocations.filter(x => x.locationId === this.clinic._id);
  }
  
  addNewClinicSchedule() {
    this.clinicScheduleForm = this.formBuilder.group({
      'clinicScheduleArray': this.formBuilder.array([
        this.formBuilder.group({
          day: ['', [<any>Validators.required]],
          startTime: [this.now, [<any>Validators.required]],
          endTime: [this.now, [<any>Validators.required]],
          location: ['', [<any>Validators.required]],
          readOnly: [false]
        })
      ])
    });
  }
  pushNewClinicSchedule(schedule: any) {
    (<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray'])
      .push(
      this.formBuilder.group({
        day: ['', [<any>Validators.required]],
        startTime: [this.now, [<any>Validators.required]],
        endTime: [this.now, [<any>Validators.required]],
        location: ['', [<any>Validators.required]],
        readOnly: [false]
      })
      );
    this.subscribToFormControls();
  }
  onCreateSchedule() {
    this.schedules = [];
    let hasReadOnly = false;

    (<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray'])
      .controls.forEach((itemi, i) => {
        if (itemi.value.readOnly === true) {
          hasReadOnly = true;
        }
      });
    if (this.selectedManager !== undefined && this.selectedManager.clinicObject !== undefined && hasReadOnly) {
      this.selectedManager.schedules = [];
      (<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray'])
        .controls.forEach((itemi, i) => {
          const startTime = new Date();
          startTime.setHours(itemi.value.startTime.hour);
          startTime.setMinutes(itemi.value.startTime.minute);
          itemi.value.startTime = startTime;

          const endTime = new Date();
          endTime.setHours(itemi.value.endTime.hour);
          endTime.setMinutes(itemi.value.endTime.minute);
          itemi.value.endTime = endTime;
          this.selectedManager.schedules.push(itemi.value);
        });
      console.log(this.selectedManager);
      this.schedulerService.update(this.selectedManager).then(payload => {
        this.selectedManager = payload;
        this.loadManagerSchedules(true);
      });
    } else {
      const manager: ScheduleRecordModel = <ScheduleRecordModel>{ schedules: [] };
      delete this.locationTypeControl.value.department.units;
      manager.clinicObject = this.locationTypeControl.value;
      manager.schedulerType = this.selectedSchedulerType;
      manager.facilityId = this.selectedFacility._id;
      (<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray'])
        .controls.forEach((itemi, i) => {
          const startTime = new Date();
          startTime.setHours(itemi.value.startTime.hour);
          startTime.setMinutes(itemi.value.startTime.minute);
          itemi.value.startTime = startTime;

          const endTime = new Date();
          endTime.setHours(itemi.value.endTime.hour);
          endTime.setMinutes(itemi.value.endTime.minute);
          itemi.value.endTime = endTime;
          manager.schedules.push(itemi.value);
        });
      console.log(manager);
      this.schedulerService.create(manager).subscribe(payload => {
        this.selectedManager = payload;
        this.loadManagerSchedules(true);
      })
    }
  }
  closeClinicSchedule(clinic: any, i: any) {
    (<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray']).controls.splice(i, 1);
    this.loadManagerSchedules(false);
  }
}
