import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
const request = require('superagent');
@Injectable()
export class InventoryInitialiserService {
    public _initialiserRest;
    
    private missionAnnouncedSource = new Subject<string>();
    missionAnnounced$ = this.missionAnnouncedSource.asObservable();
    constructor(
        private _socketService: SocketService,
        private _restService: RestService) {}

    announceMission(mission: string) {
        this.missionAnnouncedSource.next(mission);
    }

    post(body: any,params:any) {
        const host = this._restService.getHost();
        const path = host + '/inventory-initialiser';
        return request
            .post(path)
            .send(body);
    }
}

