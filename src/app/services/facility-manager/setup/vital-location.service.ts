import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class VitaLocationService {
  public _socket;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('vitalocations');
    this._socket = _socketService.getService('vitalocations');
    this._socket.timeout = 30000;
    this.listenerCreate = Observable.fromEvent(this._socket, 'created');
    this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
    this.listenerDelete = Observable.fromEvent(this._socket, 'deleted');

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

  create(vitaLocation: any) {
    return this._socket.create(vitaLocation);
  }
  update(vitaLocation: any) {
    return this._socket.update(vitaLocation._id, vitaLocation);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
