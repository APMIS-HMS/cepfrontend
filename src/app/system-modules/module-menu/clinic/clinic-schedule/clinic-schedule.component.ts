import { Component, OnInit } from '@angular/core';
import { DxDateBoxModule } from 'devextreme-angular';
// import 'devextreme-intl';
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

  constructor(private formBuilder: FormBuilder, private locationService: LocationService,
    private locker: CoolLocalStorage, private schedulerTypeService: SchedulerTypeService,
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
      this.schedulerService.find({ query: { 'locationType._id': value._id.toString() } }).then(payload => {
        if (payload.data.length > 0) {
          this.selectedManager = payload.data[0];
          this.loadManagerSchedules(false);
        }
      });
    });
  }
  onSelectSchedulerManager(manager: ScheduleRecordModel) {
    this.selectedManager = manager;
    this.locationTypeControl.setValue(this.clinics.filter(x => x._id === this.selectedManager.locationType._id)[0]);
    this.loadManagerSchedules(false);
  }
  loadManagerSchedules(force: boolean) {
    this.clearAllSchedules();
    if (this.selectedManager !== undefined && this.selectedManager.locationType !== undefined && force === false) {
      this.selectedManager.schedules.forEach((itemi, i) => {
        (<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray']).push(
          this.formBuilder.group({
            day: [itemi.day, [<any>Validators.required]],
            startTime: [itemi.startTime, [<any>Validators.required]],
            endTime: [itemi.endTime, [<any>Validators.required]],
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
    this.schedulerTypeService.findAll().then(payload => {
      payload.data.forEach((itemi, i) => {
        if (itemi.name === 'Clinic') {
          this.selectedSchedulerType = itemi;
        }
      });
    });
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
    // (<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray']).controls.reverse();
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
    console.log(hasReadOnly);
    if (this.selectedManager !== undefined && this.selectedManager.locationType !== undefined && hasReadOnly) {
      this.selectedManager.schedules = [];
      (<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray'])
        .controls.forEach((itemi, i) => {
          this.selectedManager.schedules.push(itemi.value);
        });
      this.schedulerService.update(this.selectedManager).then(payload => {
        this.selectedManager = payload;
        this.loadManagerSchedules(true);
      });
    } else {
      const manager: ScheduleRecordModel = <ScheduleRecordModel>{ schedules: [] };
      manager.locationType = this.locationTypeControl.value;
      manager.schedulerType = this.selectedSchedulerType;
      manager.facilityId = this.selectedFacility._id;
      (<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray'])
        .controls.forEach((itemi, i) => {
          manager.schedules.push(itemi.value);
        });
      this.schedulerService.create(manager).then(payload => {
        this.scheduleManagers = payload.data;
        this.loadManagerSchedules(true);
      });
    }
  }
  closeClinicSchedule(clinic: any, i: any) {
    (<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray']).controls.splice(i, 1);
    console.log(this.selectedManager);
    this.loadManagerSchedules(false);
  }
}
