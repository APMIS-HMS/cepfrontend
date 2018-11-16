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
selectedClinic;
facilityClinics: any;
  constructor(private diagnosisService: DiagnosisReportService,
    private locker: CoolLocalStorage, private systemModuleService: SystemModuleService,
    private facilityService: FacilitiesService) { }

  ngOnInit() {
    this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getFacilityDiagnosisReport();
    this.getClinicByFacility();
    this.setDateRangeToDefault();
  }

  setDiagnosisByDateRange(dateRange: IDateRange) {
    if (dateRange != null) {
      this.dateRange = dateRange;
      this.diagnosisService.find({
        query: {
          facilityId: this.currentFacility._id,
          clinicId: this.selectedClinic,
          from: dateRange.from,
          to: dateRange.to
        }
      }).then(payload => {
        this.filteredDiagnosis = payload;
      });
    }
  }
  setSearchFilter(selectedVal) {
    console.log(this.dateRange);
    this.selectedClinic = selectedVal;
      this.diagnosisService.find({
        query: {
          facilityId: this.currentFacility._id,
          clinicId: this.selectedClinic,
          from: this.dateRange.from,
          to: this.dateRange.to
        }
      }).then(payload => {
        this.filteredDiagnosis = payload;
      });
  }
  getClinicByFacility() {
      this.facilityService.find( {
        query: {
          _id: this.currentFacility._id
        }
      }).then(payload => {
        this.facilityClinics = payload.data[0].minorLocations;
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
  setDateRangeToDefault() {
    if (this.dateRange === undefined) {
      this.dateRange = {
        from: new Date(),
        to: new Date()
        };
    }
  }
}
