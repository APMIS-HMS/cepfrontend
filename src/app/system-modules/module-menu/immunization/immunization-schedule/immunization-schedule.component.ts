import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Facility } from '../../../../models/index';
import { DrugListApiService } from '../../../../services/facility-manager/setup';
import { ImmunizationScheduleService } from '../../../../services/facility-manager/setup/immunization-schedule.service';

@Component({
  selector: 'app-immunization-schedule',
  templateUrl: './immunization-schedule.component.html',
  styleUrls: ['./immunization-schedule.component.scss']
})
export class ImmunizationScheduleComponent implements OnInit {
  facility: Facility = <Facility>{};
  immunizationSchedules = [];
  loading: boolean = true;
  openSearch: boolean = false;

  constructor(
    private _router: Router,
    private _locker: CoolLocalStorage,
    private _systemModuleService: SystemModuleService,
    // private _immunization
    private _immunizationScheduleService: ImmunizationScheduleService
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this._getAllImmunizationSchedules();
  }

  onClickAddImmunizationSchedule(immuneSchedule) {
    console.log(immuneSchedule);
    console.log(!!immuneSchedule);
    // Check if it's a new record.
    if (!!immuneSchedule) {
      this._systemModuleService.on();
      this._router.navigate(['/dashboard/immunization/new']).then(res => {
        this._systemModuleService.off();
      });
    } else {
      this._systemModuleService.on();
      this._router.navigate(['/dashboard/immunization/new']).then(res => {
        this._systemModuleService.off();
      });
    }
  }

_getAllImmunizationSchedules() {
  this._immunizationScheduleService.find({ query: { facilityId: this.facility._id }}).then(res => {
    console.log(res);
  });
}

  onClickOpenSearch() {
    this.openSearch = true;
  }
}
