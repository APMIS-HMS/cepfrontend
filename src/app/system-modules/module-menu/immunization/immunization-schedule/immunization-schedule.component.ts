import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, ImmunizationSchedule } from '../../../../models/index';
import { DrugListApiService } from '../../../../services/facility-manager/setup';
import { ImmunizationScheduleService } from '../../../../services/facility-manager/setup/immunization-schedule.service';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-immunization-schedule',
  templateUrl: './immunization-schedule.component.html',
  styleUrls: ['./immunization-schedule.component.scss']
})
export class ImmunizationScheduleComponent implements OnInit {
  immunizationScheduleSearch = new FormControl();
  facility: Facility = <Facility>{};
  immunizationSchedules: ImmunizationSchedule[] = [];
  loading: boolean = true;
  openSearch: boolean = false;

  constructor(
    private _router: Router,
    private _locker: CoolLocalStorage,
    private _systemModuleService: SystemModuleService,
    private _immunizationScheduleService: ImmunizationScheduleService
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this._getAllImmunizationSchedules();

    this.immunizationScheduleSearch.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .do(val => { this.immunizationSchedules = []; this.loading = true; })
      .switchMap((term) => Observable.fromPromise(this._immunizationScheduleService.find({
        query: { facilityId: this.facility._id, name: { $regex: term, '$options': 'i' }, $sort: { createdAt: -1 } }
      }))).subscribe((res: any) => {
        this.loading = false;
        this.immunizationSchedules = [];
        if (res.data.length > 0) {
          const arrayLength = res.data.length;
          for (let i = 0; i < arrayLength; i++) {
            const immuneSchedule = res.data[i];
            immuneSchedule.vaccines.forEach(vaccine => {
              const immuneObj = <ImmunizationSchedule>{
                _id: immuneSchedule._id,
                facilityId: immuneSchedule.facilityId,
                name: immuneSchedule.name,
                immuneServiceId: immuneSchedule.serviceId,
                vaccineName: vaccine.name,
                vaccineNameCode: vaccine.nameCode,
                code: vaccine.code,
                numberOfDosage: vaccine.numberOfDosage,
                vaccinationSite: vaccine.vaccinationSite,
                dosage: vaccine.dosage,
                vaccineServiceId: vaccine.serviceId,
                intervals: vaccine.intervals
              };
              this.immunizationSchedules.push(immuneObj);
            });
          }
        }
      }, (err) => console.log(err));

  }

  onClickAddImmunizationSchedule(immuneSchedule) {
    // Check if it's a new record.
    if (!!immuneSchedule) {
      this._systemModuleService.on();
      this._router.navigate([`/dashboard/immunization/new/${immuneSchedule._id}`]).then(res => {
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
  this._immunizationScheduleService.find({ query: { facilityId: this.facility._id, $sort: { createdAt: -1 } }}).then(res => {
    this.loading = false;
    if (res.data.length > 0) {
      const arrayLength = res.data.length;
      for (let i = 0; i < arrayLength; i++) {
        const immuneSchedule = res.data[i];
        immuneSchedule.vaccines.forEach(vaccine => {
          const immuneObj = <ImmunizationSchedule>{
            _id: immuneSchedule._id,
            facilityId: immuneSchedule.facilityId,
            name: immuneSchedule.name,
            immuneServiceId: immuneSchedule.serviceId,
            vaccineName: vaccine.name,
            vaccineNameCode: vaccine.nameCode,
            code: vaccine.code,
            numberOfDosage: vaccine.numberOfDosage,
            vaccinationSite: vaccine.vaccinationSite,
            dosage: vaccine.dosage,
            vaccineServiceId: vaccine.serviceId,
            intervals: vaccine.intervals
          };
          this.immunizationSchedules.push(immuneObj);
        });
      }
    }
  });
}

  onClickOpenSearch() {
    this.openSearch = true;
  }
}
