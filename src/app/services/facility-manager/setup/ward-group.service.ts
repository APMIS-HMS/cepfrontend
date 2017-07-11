import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class RoomGroupService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('wardroomgroups');
    this._socket = _socketService.getService('wardroomgroups');
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

  create(wardGroup:any) {
    return this._socket.create(wardGroup);
  }
  update(wardGroup: any) {
    return this._socket.update(wardGroup._id, wardGroup);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}