import { from } from 'rxjs/observable/from';
import { ClinicTabGroup, AppointmentReportStatus, AppointmentSearchCriteria } from './../../../../../../models/reports/clinic-attendance';
import { AppointmentReportService } from './../../../../../../services/reports/clinic-manager/appointment-report.service';
import { Component, OnInit } from '@angular/core';
import { ClinicAttendanceReportService } from 'app/services/reports';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from 'app/models';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { IDateRange } from 'ng-pick-daterange';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-clinic-attendance',
  templateUrl: './clinic-attendance.component.html',
  styleUrls: ['./clinic-attendance.component.scss']
})
export class ClinicAttendanceComponent implements OnInit {

  isClinicAttendanceLoading = true;
  isAppointmentLoading = true;
  currentFacility: Facility = <Facility>{};
  fileteredAppointments;
  dateRange: any;
  filteredAttendance;
  totalNewAppointment = 0;
  totalFollowUpAppointment = 0;
  searchCriteriaOptions = [];
  searchControl = new FormControl();
  searchCriteria = new FormControl('Search');
  activeTabIndex: number;
  appointmentStatus = [];
  selectedSearchCriteria: string;
  searchedProvider: string;
  searchedPatient: string;
  selectedStatus: string;
  providerName: string;
  patientName: string;



  constructor(private clinicAttendance: ClinicAttendanceReportService,
    private locker: CoolLocalStorage, private systemModuleService: SystemModuleService,
    private appointmentService: AppointmentReportService) {
      this.activeTabIndex = 0;
    }
    ngOnInit() {
      this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
      this.appointmentStatus = this.getObjeckKeys(AppointmentReportStatus);
      this.searchCriteriaOptions = this.getObjeckKeys(AppointmentSearchCriteria);
      this.loadActiveTabIndexData();
      this.initialiseDateRange();

      // TODO:: disable searchControl on component init;
      //        enable only when search criteria is enabled
      

      // search filter is performed based on the search criteria selected by the user
      // searchCriterias = ['By Provider', 'By Patient']
      this.searchControl.valueChanges.debounceTime(200).distinctUntilChanged().subscribe(val => {
        if (this.selectedSearchCriteria === AppointmentSearchCriteria.ByProvider && this.searchControl.value.length > 3) {
          this.providerName = val;
          this.isAppointmentLoading = true;
            this.appointmentService.find({
              query: {
                facilityId: this.currentFacility._id,
                providerName: this.providerName,
                patientName: this.patientName,
                startDate: this.dateRange.from,
                endDate: this.dateRange.to,
                status: this.selectedStatus
              }
            }).then((paydata) => {
              this.fileteredAppointments = paydata.data;
              this.isAppointmentLoading = false;
            });
        } else if (this.selectedSearchCriteria === AppointmentSearchCriteria.ByPatient && this.searchControl.value.length > 3) {
          this.patientName = val;
          this.isAppointmentLoading = false;
            this.appointmentService.find({
              query: {
                facilityId: this.currentFacility._id,
                providerName: this.providerName,
                patientName: this.patientName,
                startDate: this.dateRange.from,
                endDate: this.dateRange.to,
                status: this.selectedStatus
              }
            }).then((payload) => {
              this.fileteredAppointments = payload.data;
              this.isAppointmentLoading = false;
            });
        } else if (this.selectedSearchCriteria === AppointmentSearchCriteria.ByPatient && this.searchControl.value.length < 1) {
              this.getFacilityAppointments();
        } else if (this.selectedSearchCriteria === AppointmentSearchCriteria.ByProvider && this.searchControl.value.length < 1) {
          this.getFacilityAppointments();
        }
      });
    }

    // we set default dateRange to current date for filter selection
    // without date selection
    initialiseDateRange() {
      if (this.dateRange === undefined) {
        this.dateRange = {
          from: new Date(),
          to: new Date()
          };
      }
    }
    setSearchFilter(data) {
      this.selectedSearchCriteria = data;
      this.searchControl.setValue('');
   }

   loadActiveTabIndexData() {
    if (this.activeTabIndex === ClinicTabGroup.AppointmentReport) {
        this.getFacilityAppointments();
    } else if (this.activeTabIndex === ClinicTabGroup.ClinicAttendance) {
        this.getFacilityAttendance();
    }
   }
   getObjeckKeys(obj) {
     return Object.keys(obj).map(val => obj[val]);
   }
   setFilterByDateRange(dateRange: IDateRange): any {
    this.dateRange = dateRange;
		if (dateRange !== null) {
      if (this.activeTabIndex === ClinicTabGroup.ClinicAttendance) {
        this.isClinicAttendanceLoading = true;
            this.clinicAttendance.find({
            query: {
              facilityId: this.currentFacility._id,
              providerName: this.providerName,
              patientName: this.patientName,
              startDate: dateRange.from,
              endDate: dateRange.to,
              status: this.selectedStatus
            }
          }).then(payload => {
            this.filteredAttendance = payload.data;
            this.calculateGrandTotal(this.filteredAttendance);
            this.isClinicAttendanceLoading = false;
          });
      } else if (this.activeTabIndex === ClinicTabGroup.AppointmentReport) {
        this.isAppointmentLoading = true;
        this.appointmentService.find({
          query: {
            facilityId: this.currentFacility._id,
            providerName: this.providerName,
            patientName: this.patientName,
            startDate: this.dateRange.from,
            endDate: this.dateRange.to,
            status: this.selectedStatus
          }
          }).then(payload => {
            this.fileteredAppointments = payload.data;
            this.isAppointmentLoading = false;
          });
      }
		}
  }
  onTabClick(tabIndex) {
    this.activeTabIndex = tabIndex;
    this.loadActiveTabIndexData();
  }

  getFacilityAttendance() {
      this.clinicAttendance.find({
        query: {
          facilityId: this.currentFacility._id
        }
      }).then(payload => {
          this.filteredAttendance = payload.data;
          this.isClinicAttendanceLoading = false;
          this.calculateGrandTotal(this.filteredAttendance);
      });
  }

  getFacilityAppointments() {
    if (this.currentFacility !== undefined || this.currentFacility._id !== '') {
      this.appointmentService.find({
        query: {
          facilityId: this.currentFacility._id
        }
      }).then(payload => {
          this.fileteredAppointments = payload.data;
          this.isAppointmentLoading = false;
      });
    }
  }
  onStatusChanged(selectedStatus) {
    this.selectedStatus = selectedStatus;
    this.isAppointmentLoading = false;
    this.appointmentService.find({
      query: {
        facilityId: this.currentFacility._id,
        providerName: this.providerName,
        patientName: this.patientName,
        startDate: this.dateRange.from,
        endDate: this.dateRange.to,
        status: this.selectedStatus
      }
    }).then(payload => {
      this.fileteredAppointments = payload.data;
      this.isAppointmentLoading = false;
    });
  }

  calculateGrandTotal(data) {
    if (data !== undefined || data !== null) {
      const newAppointmentSum = [];
      const followUpAppointmentSum = [];
      data.forEach(item => {
        newAppointmentSum.push(item.new.totalMale + item.new.totalFemale);
        followUpAppointmentSum.push(item.followUp.totalMale + item.followUp.totalFemale);
      });
      this.totalNewAppointment = newAppointmentSum.reduce((totalSum, nextVal) => totalSum + nextVal, 0);
      this.totalFollowUpAppointment = followUpAppointmentSum.reduce((totalSum, nextVal) => totalSum + nextVal, 0);
    }
  }
}
