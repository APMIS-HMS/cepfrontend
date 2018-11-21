import { Injectable } from '@angular/core';
import { SocketService, RestService } from '../../../feathers/feathers.service';
import { DiagnosisReport } from 'app/models/reports/diagnosis-report';

@Injectable()
export class DiagnosisReportService {
    public _socket;
    public _rest;
    diagnosis: DiagnosisReport[] = [];
    constructor(private socketService: SocketService, private restService: RestService) {
        this._socket = this.socketService.getService('diagnosis-report');
        this._rest = this.socketService.getService('disgnosis-report');
        this.diagnosis = [
            {
                hospitalNumber: 'LT/777/108A',
                sex: 'Female',
                age: 18,
                diagnosisCode: 'Mal/8739',
                clinic: 'Cardiology'
            },
            {
                hospitalNumber: 'LT/877/107A',
                sex: 'Male',
                age: 108,
                diagnosisCode: 'Thy/8739',
                clinic: 'Radiology'
            },
            {
                hospitalNumber: 'LT/877/107A',
                sex: 'Male',
                age: 30,
                diagnosisCode: 'Mal/8739',
                clinic: 'Cardiology'
            }
        ];
    }

    find(query) {
        const diagnosisPromise = new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.diagnosis);
            }, 1000);
        });
        return diagnosisPromise;
        // return this._socket.find(query);
    }
    get(query) {
        return this._socket.find(query);
    }
}
