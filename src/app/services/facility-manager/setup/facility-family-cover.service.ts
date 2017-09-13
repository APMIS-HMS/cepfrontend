import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
const request = require('superagent');
// import 'rxjs/Rx';

@Injectable()
export class FacilityFamilyCoverService {
  public _socket;
  private _rest;

  private familyCoverAnnouncedSource = new Subject<Object>();
  familyCoverAnnounced$ = this.familyCoverAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('families');
    this._socket = _socketService.getService('families');
    this._socket.timeout = 20000;
    this._socket.on('created', function (gender) {

    });
  }
  announceCompanyCover(familyCover: Object) {
    this.familyCoverAnnouncedSource.next(familyCover);
  }
  receiveCompanyCover(): Observable<Object> {
    return this.familyCoverAnnouncedSource.asObservable();
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

  update(familyCover: any) {
    return this._socket.update(familyCover._id, familyCover);
  }

  familycovers(facilityId, familyCoverId?, search?) {
    const host = this._restService.getHost();
    const path = host + '/distinct-familycover-plans';
    return request
      .get(path)
      .query({ facilityId: facilityId, familyCoverId: familyCoverId, search: search });
  }
  updateBeneficiaryList(formData) {
    const host = this._restService.getHost();
    const path = host + '/family-beneficiaries';
    return request
      .post(path)
      .send(formData);
  }

}
