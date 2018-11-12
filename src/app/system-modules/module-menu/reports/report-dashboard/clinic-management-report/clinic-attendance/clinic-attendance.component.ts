import { Component, OnInit } from '@angular/core';
import { ClinicAttendanceReportService } from 'app/services/reports';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from 'app/models';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { IDateRange } from 'ng-pick-daterange';

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

  ngOnInit() {
    this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getFacilityAppointments();
  }

	setFacilityAppointmentsByDateRange(dateRange: IDateRange): any {
    console.log(dateRange);
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
    if (this.currentFacility !== undefined || this.currentFacility._id !== '') {
        this.clinicAttendance.find({
          query: {
            facilityId: this.currentFacility
          }
        }).then(payload => {
            this.isClinicAttendanceLoading = false;
            this.attendanceReports = payload;
            this.totalNewAppointment = this.attendanceReports[0].totalNewAppointment || 0;
            this.totalFollowUpAppointment = this.attendanceReports[0].totalFollowUpAppointment || 0;
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
