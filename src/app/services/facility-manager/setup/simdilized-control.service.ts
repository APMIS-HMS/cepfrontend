import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx'

@Injectable()
export class SimdilizedControlService {
    public url: string;
    public _socket;
    private _rest;
    private listner;
    constructor(
        private _socketService: SocketService,
        private _restService: RestService
    ) {
        this._rest = _restService.getService(this.url);
        this._socket = _socketService.getService(this.url);
    }

    find(query: any, isRest: boolean) {
        if (isRest) {
            return this._socket.find(query);
        } else {
            return this._rest.find(query);
        }
    }

    
}