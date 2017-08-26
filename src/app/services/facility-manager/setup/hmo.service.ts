import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// import 'rxjs/Rx';

@Injectable()
export class HmoService {
  public _socket;
  private _rest;

  private hmoAnnouncedSource = new Subject<Object>();
  hmoAnnounced$ = this.hmoAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('hmos');
    this._socket = _socketService.getService('hmos');
     this._socket.timeout = 90000;
    this._socket.on('created', function (gender) {

    });
  }
  announceHmo(hmo: Object) {
    this.hmoAnnouncedSource.next(hmo);
  }
  receiveHmo(): Observable<Object> {
    return this.hmoAnnouncedSource.asObservable();
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

  update(hmo: any) {
    return this._socket.update(hmo._id, hmo);
  }
}
