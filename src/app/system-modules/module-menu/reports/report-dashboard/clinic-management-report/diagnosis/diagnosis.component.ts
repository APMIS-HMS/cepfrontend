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
    this.getClinicByFacility();
    this.initialiseDateRange();
    this.getFacilityDiagnosisReport();
  }

  setDiagnosisByDateRange(dateRange: IDateRange) {
    this.isDiagnosisLoading = true;
    if (dateRange != null) {
      this.dateRange = dateRange;
      this.diagnosisService.find({
        query: {
          facilityId: this.currentFacility._id,
          clinicId: this.selectedClinic,
          startDate: dateRange.from,
          endDate: dateRange.to
        }
      }).then(payload => {
        this.filteredDiagnosis = payload;
        this.isDiagnosisLoading = false;
      });
    }
  }
  setSearchFilter(selectedVal) {
    this.isDiagnosisLoading = true;
    this.selectedClinic = selectedVal;
      this.diagnosisService.find({
        query: {
          facilityId: this.currentFacility._id,
          clinicId: this.selectedClinic,
          stateDate: this.dateRange.from,
          endDate: this.dateRange.to
        }
      }).then(payload => {
        this.filteredDiagnosis = payload;
        this.isDiagnosisLoading = false;
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
      this.isDiagnosisLoading = true;
      this.diagnosisService.find({
        query: {
          facilityId: this.currentFacility._id
        }
      }).then(payload => {
          this.filteredDiagnosis = payload;
          this.isDiagnosisLoading = false;

      });
  }
  initialiseDateRange() {
    if (this.dateRange === undefined) {
      this.dateRange = {
        from: new Date(),
        to: new Date()
        };
    }
  }
}
