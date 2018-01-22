import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppointmentTypeService {
  public _socket;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('appointmenttypes');
    this._socket = _socketService.getService('appointmenttypes');
    this._socket.timeout = 30000;
    this.listenerCreate = Observable.fromEvent(this._socket, 'created');
    this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
    this.listenerDelete = Observable.fromEvent(this._socket, 'deleted');

  }

  find(query: any) {
    return this._rest.find(query);
  }

  findAll() {
    return this._rest.find();
  }
  get(id: string, query: any) {
    return this._rest.get(id, query);
  }

  create(corporatecacility: any) {
    return this._rest.create(corporatecacility);
  }
  update(corporatecacility: any) {
    return this._rest.update(corporatecacility._id, corporatecacility);
  }
  remove(id: string, query: any) {
    return this._rest.remove(id, query);
  }
}
