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

  isClinicAttendanceLoading: boolean = true;
  currentFacility: Facility = <Facility>{};
  attendanceReports;
  dateRange: any;
  filteredAttendanceReport: any;
  totalNewAppointment: number = 0;
  totalFollowUpAppointment: number = 0;
  constructor(private clinicAttendance: ClinicAttendanceReportService,
    private locker: CoolLocalStorage, private systemModuleService: SystemModuleService) { }
	searchControl = new FormControl();
	searchCriteria = new FormControl('Search');

  ngOnInit() {
    this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getFacilityAppointments();
  }

	setFacilityAppointmentsByDateRange(dateRange: IDateRange): any {
		if (dateRange !== null) {
      this.dateRange = dateRange;
      this.clinicAttendance.find({
        query: {
          facilityId: this.currentFacility,
          from: dateRange.from,
          to: dateRange.to
        }
      }).then(payload => {
        this.filteredAttendanceReport = payload;
      });
		}
	}

  getFacilityAppointments() {
    const newAppointmentCount = [];
    const followUpAppointmentCount = [];
    if (this.currentFacility !== undefined || this.currentFacility._id !== '') {
        this.clinicAttendance.find({
          query: {
            facilityId: this.currentFacility
          }
        }).then(payload => {
            this.isClinicAttendanceLoading = false;
            this.attendanceReports = payload;

            this.attendanceReports.forEach(item => {
              newAppointmentCount.push(item.new.totalMale + item.new.totalFemale);
              followUpAppointmentCount.push(item.followUp.totalMale + item.followUp.totalFemale);
            });
            this.totalNewAppointment = newAppointmentCount.reduce((a, b) => a + b, 0);
            this.totalFollowUpAppointment = followUpAppointmentCount.reduce((a, b) => a + b, 0);
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
