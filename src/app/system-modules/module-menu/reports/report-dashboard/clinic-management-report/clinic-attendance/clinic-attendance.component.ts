import { from } from 'rxjs/observable/from';
import { ClinicTabGroup, AppointmentReportStatus, AppointmentSearchCriteria } from './../../../../../../models/reports/clinic-attendance';
import { AppointmentReportService } from './../../../../../../services/reports/clinic-manager/appointment-report.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  currentFacility: Facility = <Facility>{};
  fileteredAppointments;
  dateRange: any;
  filteredAttendance: any;
  totalNewAppointment = 0;
  totalFollowUpAppointment = 0;
  searchCriteriaOptions = [];
  searchControl = new FormControl();
  searchCriteria = new FormControl('Search');
  activeTabIndex;
  appointmentStatus = [];
  selectedSearchCriteria = '';
  searchedProvider = '';
  searchedPatient = '';
  selectedStatus = '';



  constructor(private clinicAttendance: ClinicAttendanceReportService,
    private locker: CoolLocalStorage, private systemModuleService: SystemModuleService,
    private appointmentService: AppointmentReportService) {
      this.activeTabIndex = 0;
    }
    ngOnInit() {
      this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
      this.appointmentStatus = Object.keys(AppointmentReportStatus).map(val => AppointmentReportStatus[val]);
      this.getFacilityAttendance();
      this.getSearchCriteria();
      this.setDateRangeToDefault();

      // search filter is performed based on the search criteria selected by the user
      // searchCriterias = ['By Provider', 'By Patient']
      this.searchControl.valueChanges.debounceTime(200).distinctUntilChanged().subscribe(val => {
        if (this.selectedSearchCriteria === AppointmentSearchCriteria.ByProvider && this.searchControl.value.length > 3) {
            this.appointmentService.find({
              query: {
                facilityId: this.currentFacility._id,
                searchText: val,
                from: this.dateRange.from,
                to: this.dateRange.to,
                status: this.selectedStatus
              }
            }).then((pay) => {
              this.fileteredAppointments = pay;
            });
        } else if (this.selectedSearchCriteria === AppointmentSearchCriteria.ByPatient && this.searchControl.value.length > 3) {
            this.appointmentService.find({
              query: {
                facilityId: this.currentFacility._id,
                searchText: val,
                from: this.dateRange.from,
                to: this.dateRange.to,
                status: this.selectedStatus
              }
            }).then((payload) => {
              this.fileteredAppointments = payload;
            });
        }
      });
    }

    // we set default dateRange to current date for filter selection
    // without date selection
    setDateRangeToDefault() {
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

   setFilterByDateRange(dateRange: IDateRange): any {
    this.dateRange = dateRange;
		if (dateRange !== null) {
      if (this.activeTabIndex === ClinicTabGroup.ClinicAttendance) {
            this.clinicAttendance.find({
            query: {
              facilityId: this.currentFacility._id,
              from: dateRange.from,
              to: dateRange.to
            }
          }).then(payload => {
            this.filteredAttendance = payload;
            this.calculateGrandTotal(this.filteredAttendance);
          });
      } else if (this.activeTabIndex === ClinicTabGroup.AppointmentReport) {
        this.appointmentService.find({
          query: {
            facilityId: this.currentFacility._id,
            searchText: this.searchControl.value,
            from: this.dateRange.from,
            to: this.dateRange.to,
            status: this.selectedStatus
          }
          }).then(payload => {
            console.log(payload);
            this.fileteredAppointments = payload;
          });
      }
		}
  }
  onTabClick(tabIndex) {
    this.activeTabIndex = tabIndex;
  }

  getSearchCriteria() {
    this.searchCriteriaOptions = Object.keys(AppointmentSearchCriteria).map(val => AppointmentSearchCriteria[val]);
  }

  getFacilityAttendance() {
    if (this.currentFacility !== undefined || this.currentFacility._id !== '') {
        this.clinicAttendance.find({
          query: {
            facilityId: this.currentFacility._id
          }
        }).then(payload => {
            this.isClinicAttendanceLoading = false;
            this.filteredAttendance = payload;
            this.calculateGrandTotal(this.filteredAttendance);
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

  getFacilityAppointments() {
    if (this.currentFacility !== undefined || this.currentFacility._id !== '') {
      this.appointmentService.find({
        query: {
          facilityId: this.currentFacility._id
        }
      }).then(payload => {
          this.fileteredAppointments = payload;
      });
    }
  }

  onStatusChanged(selectedStatus) {
    this.selectedStatus = selectedStatus;
    this.appointmentService.find({
      query: {
        facilityId: this.currentFacility._id,
        searchText: this.searchControl.value,
        from: this.dateRange.from,
        to: this.dateRange.to,
        status: this.selectedStatus
      }
    }).then(payload => {
      this.fileteredAppointments = payload;
    });
  }

  calculateGrandTotal(data) {
    if (data !== undefined || data !== null) {
      const newAppointmentCount = [];
      const followUpAppointmentCount = [];
      data.forEach(item => {
        newAppointmentCount.push(item.new.totalMale + item.new.totalFemale);
        followUpAppointmentCount.push(item.followUp.totalMale + item.followUp.totalFemale);
      });
      this.totalNewAppointment = newAppointmentCount.reduce((totalSum, nextVal) => totalSum + nextVal, 0);
      this.totalFollowUpAppointment = followUpAppointmentCount.reduce((totalSum, nextVal) => totalSum + nextVal, 0);
    }
  }
}
