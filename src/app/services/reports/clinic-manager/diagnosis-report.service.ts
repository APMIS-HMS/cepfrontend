import { Injectable } from '@angular/core';
import { SocketService, RestService } from '../../../feathers/feathers.service';
import { DiagnosisReport } from 'app/models/reports/diagnosis-report';

@Injectable()
export class DiagnosisReportService {
    public _socket;
    public _rest;
    diagnosis: DiagnosisReport[] = [];
    constructor(private socketService: SocketService, private restService: RestService) {
        this._socket = this.socketService.getService('appointment-diagnosis-report');
        this._rest = this.socketService.getService('appointment-disgnosis-report');
    }

    find(query) {
         return this._socket.find(query);
    }
    get(query) {
        return this._socket.find(query);
    }
}
