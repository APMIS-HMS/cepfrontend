import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
const request = require('superagent');
// import 'rxjs/Rx';

@Injectable()
export class FacilityCompanyCoverService {
  public _socket;
  private _rest;

  private companyCoverAnnouncedSource = new Subject<Object>();
  companyCoverAnnounced$ = this.companyCoverAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('companycovers');
    this._socket = _socketService.getService('companycovers');
     this._socket.timeout = 20000;
    this._socket.on('created', function (gender) {

    });
  }
  announceCompanyCover(companyCover: Object) {
    this.companyCoverAnnouncedSource.next(companyCover);
  }
  receiveCompanyCover(): Observable<Object> {
    return this.companyCoverAnnouncedSource.asObservable();
  }
  find(query: any) {
    return this._socket.find(query);
  }

  findAll() {
    return this._socket.find();
  }
  get(id: string, query: any) {
    return this._socket.get(id, query);
  }

  create(gender: any) {
    return this._socket.create(gender);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  update(companyCover: any) {
    return this._socket.update(companyCover._id, companyCover);
  }

  companycovers(facilityId, companyCoverId?, search?) {
    const host = this._restService.getHost();
    const path = host + '/distinct-companycover-plans';
    return request
      .get(path)
      .query({ facilityId: facilityId, companyCoverId:companyCoverId, search:search });
  }
}
