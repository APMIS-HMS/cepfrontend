import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// import 'rxjs/Rx';

@Injectable()
export class BillingService {
  public _socket;
  private _rest;
  public updatelistner;

  private billingAnnouncedSource = new Subject<Object>();
  billingAnnounced$ = this.billingAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('billings');
    this._socket = _socketService.getService('billings');
    this.updatelistner = Observable.fromEvent(this._socket, 'updated');
    this._socket.timeout = 90000;
    this._socket.on('created', function (gender) {

    });
  }
  announceBilling(billing: Object) {
    this.billingAnnouncedSource.next(billing);
  }
  receiveBilling(): Observable<Object> {
    return this.billingAnnouncedSource.asObservable();
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

  update(billing: any) {
    return this._socket.update(billing._id, billing);
  }

  patch(_id: any, data: any, param: any) {
    return this._socket.patch(_id, data, param);
  }
}
