import { Component, OnInit } from '@angular/core';
import { AppointmentReport } from '../../../../models/reports/appointment-report';
import { AppointmentReportService } from '../../../../services/reports';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from 'app/models';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss']
})
export class VisitsComponent implements OnInit {

  appointments: AppointmentReport[] = [];
  currentFacility: Facility = <Facility>{};
  facilityAppointments;

  constructor(private appointreportService: AppointmentReportService,
    private locker: CoolLocalStorage) {
    this.appointments = [
      {
        provider: 'Dr. Kemi Awosile',
        time: '12:20 PM',
        patientName: 'Oyelola Ola',
        apmisId: '***89J',
        phone: '080807487585',
        appointmentType: 'new',
        status: 'Checked In'
      },
      {
        provider: 'Dr. Kemi Awosile',
        time: '12:20 PM',
        patientName: 'Oyelola Ola',
        apmisId: '***0LB',
        phone: '080807487585',
        appointmentType: 'registration',
        status: 'Checked Out'
      }
    ];
  }

  ngOnInit() {
    this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
  }

  getFacilityAppointments() {
    // get cappointment 
    this.appointreportService.find({
      query: {
        facilityId: this.currentFacility
      }
    }).then(payload => {
      this.facilityAppointments = this.appointments;
    });

  }
  getFacilityApointmentsByParams(query: AppointmentQueryParams) {
    this.appointreportService.find({
      query: {
        fromDate: query.date.from,
        toDate: query.date.to,
        provider: query.provider,
        patientName: query.patient,
        status: query.status
      }
    }).then(payload => {
        // assign the payload to appointmentbyQuery
    });

  }
}

export interface AppointmentQueryParams {
  date?: {
    from: string,
    to: string,
  };
  provider?: string;
  patient?: string;
  status?: string;
}
