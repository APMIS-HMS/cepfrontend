import { Injectable } from '@angular/core';
import { SocketService, RestService } from '../../../feathers/feathers.service';
import { AppointmentReport } from 'app/models/reports/appointment-report';

@Injectable()
export class AppointmentReportService {
public _socket;
public _rest;
appointments: AppointmentReport[] = [];
constructor(private socketService: SocketService, private restService: RestService) {
    this._socket = this.socketService.getService('appointment-report');
    this._rest = this.restService.getService('appointment-report');

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

    find(query) {
        return this.appointments;
        //return this._socket.find(query);
    }
    get(query) {
        return this._socket.find(query);
    }
}
