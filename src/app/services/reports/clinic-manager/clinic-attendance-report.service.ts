import { Injectable } from '@angular/core';
import { SocketService, RestService } from '../../../feathers/feathers.service';

@Injectable()
export class ClinicAttendanceReportService {
private _socket;
private _rest;
constructor(private socketService: SocketService,
    private restService: RestService) {
        this._socket = this.socketService.getService('clinic-attendance-summary');
        this._rest = this.restService.getService('clinic-attendance-summary');
    }

    find(query) {
        return this._socket.find(query);
    }
    get(query) {
        return this._socket.find(query);
    }
}
