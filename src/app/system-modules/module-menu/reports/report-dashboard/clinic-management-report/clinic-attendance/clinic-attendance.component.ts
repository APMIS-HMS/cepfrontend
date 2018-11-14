import { ClinicTabGroup } from './../../../../../../models/reports/clinic-attendance';
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
  currentFacility: Facility = <Facility>{};
  fileteredAppointments;
  dateRange: any;
  filteredAttendance: any;
  totalNewAppointment = 0;
  totalFollowUpAppointment = 0;
  searchCriteriaOptions = [];
  searchControl = new FormControl();
  searchCriteria = new FormControl('Search');
  activeTabIndex = 0;
  constructor(private clinicAttendance: ClinicAttendanceReportService,
    private locker: CoolLocalStorage, private systemModuleService: SystemModuleService,
    private appointmentService: AppointmentReportService) { }
    ngOnInit() {
      this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
      this.getSearchCriteria();
      this.getFacilityAttendance();
    }

	setFacilityAttendanceByDateRange(dateRange: IDateRange): any {
		if (dateRange !== null) {
      if (this.activeTabIndex === ClinicTabGroup.ClinicAttendance) {
            this.clinicAttendance.find({
            query: {
              facilityId: this.currentFacility,
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
            facilityId: this.currentFacility,
            from: dateRange.from,
            to: dateRange.to
          }
          }).then(payload => {
            this.fileteredAppointments = payload;
          });
      }
		}
  }
  
  onTabClick(tabIndex) {
    this.activeTabIndex = tabIndex;
  }

  getSearchCriteria() {
    this.searchCriteriaOptions = [
      {
        _id: 1,
        name: 'By Patient'
    },
    {
      _id: 2,
      name: 'By Provider'
    }];
  }

  getFacilityAttendance() {
    if (this.currentFacility !== undefined || this.currentFacility._id !== '') {
        this.clinicAttendance.find({
          query: {
            facilityId: this.currentFacility
          }
        }).then(payload => {
            this.isClinicAttendanceLoading = false;
            this.filteredAttendance = payload;
            console.log(payload);
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
    if (this.currentFacility !== undefined || this.currentFacility._id !== ''){
      this.appointmentService.find({
        query: {
          facilityId: this.currentFacility
        }
      }).then(payload => {
          this.fileteredAppointments = payload;
      });
    }
  }

  calculateGrandTotal(data) {
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
