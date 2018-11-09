import { Component, OnInit } from '@angular/core';
import { ClinicAttendance } from '../../../../models/reports/clinic-attendance';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from '../../../../models';
import { ClinicAttendanceReportService } from '../../../../services/reports';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-clinic-attendance',
  templateUrl: './clinic-attendance.component.html',
  styleUrls: ['./clinic-attendance.component.scss']
})
export class ClinicAttendanceComponent implements OnInit {
  visits: ClinicAttendance[] = [];
  facilityVisits = [];
  reportLoading: boolean = true;
  facilityVisitRange = [];
  currentFacility: Facility = <Facility>{};
  constructor(private locker: CoolLocalStorage, private systemModuleService: SystemModuleService,
    private clinicAttendanceService: ClinicAttendanceReportService) {
    this.visits = [{
      date: '11/7/2018 - current date',
      clinicName: 'Clinic 1',
      totalCheckedInPatients: 200,
      new: {
        total: 20,
        totalFemale: 5,
        totalMale: 15
      },
      followUp: {
        total: 200,
        totalFemale: 180,
        totalMale: 20
      }
    },
    {
      date: '11/7/2018 - current date',
      clinicName: 'Clinic 2',
      totalCheckedInPatients: 200,
      new: {
        total: 40,
        totalFemale: 5,
        totalMale: 55
      },
      followUp: {
        total: 200,
        totalFemale: 80,
        totalMale: 120
      }
    }];
   }

  ngOnInit() {
    // get the facility Id of the currently loggedIn facility
      this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
      this.getClinicVisistByFacility();
  }

  getClinicVisistByFacility() {
    // call service that fetches visit by facility Id
    this.clinicAttendanceService.find(
      {
        query: {
          facilityId: this.currentFacility
        }
      }
    ).then(payload => {
        this.facilityVisits = this.visits;
        this.reportLoading = false;
    });
  }

  getClinicVisitByFacilityDateRange(fromDate: string, toDate: string) {
    if (fromDate !== undefined || fromDate !== '') {
    // call service that fetches visits by facility within date range
    // return payload to visitDates
      this.clinicAttendanceService.get({
        query: {
          from: fromDate,
          to: toDate
        }
      }).then(payload => {
          this.facilityVisitRange = this.visits;
          this.reportLoading = false;
      });
    } else {
      this.systemModuleService.announceSweetProxy(
        'You have not selected from date',
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
