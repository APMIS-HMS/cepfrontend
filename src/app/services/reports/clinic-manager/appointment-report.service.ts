import { Injectable } from '@angular/core';
import { SocketService, RestService } from '../../../feathers/feathers.service';

@Injectable()
export class AppointmentReportService {
public _socket;
public _rest;
constructor(private socketService: SocketService, private restService: RestService) {
    this._socket = this.socketService.getService('appointment-report');
    this._rest = this.restService.getService('appointment-report');
    }

    find(query) {
        return this._socket.find(query);
    }
    get(query) {
        return this._socket.find(query);
    }
}
