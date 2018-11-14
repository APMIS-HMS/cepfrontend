import { FacilitiesService } from 'app/services/facility-manager/setup';
import { Facility } from './../../../../../../models/facility-manager/setup/facility';
import { DiagnosisReportService } from './../../../../../../services/reports/clinic-manager/diagnosis-report.service';
import { Component, OnInit } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { IDateRange } from 'ng-pick-daterange';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.scss']
})
export class DiagnosisComponent implements OnInit {
diagnosis;
currentFacility: Facility = <Facility>{};
filteredDiagnosis;
isDiagnosisLoading = true;
dateRange: any;
facilityClinics: any;
  constructor(private diagnosisService: DiagnosisReportService,
    private locker: CoolLocalStorage, private systemModuleService: SystemModuleService,
    private facilityService: FacilitiesService) { }

  ngOnInit() {
    this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getFacilityDiagnosisReport();
    this.getClinicByFacility();
  }
  setDiagnosisByDateRange(dateRange: IDateRange) {
    if (dateRange != null) {
      this.diagnosisService.find({
        query: {
          facilityId: this.currentFacility,
          from: dateRange.from,
          to: dateRange.to
        }
      }).then(payload => {
        this.filteredDiagnosis = payload;
      });
    }
  }
  getClinicByFacility() {
      this.facilityService.find( {
        query: {
          facilityId: this.currentFacility
        }
      }).then(payload => {
        this.facilityClinics = payload.minorLocations;
        console.log(this.facilityClinics);
      });
  }
    getFacilityDiagnosisReport() {
      if (this.currentFacility !== undefined || this.currentFacility._id !== '') {
        this.diagnosisService.find({
          query: {
            facilityId: this.currentFacility
          }
        }).then(payload => {
            this.isDiagnosisLoading = false;
            this.filteredDiagnosis = payload;

        });
    } else {
      this.systemModuleService.announceSweetProxy(
        'You must login to perform this operation',
        'Error',
        null,
        null,
        null,
        null,
        null,
        null,
        null
      );
    }
  }
}
