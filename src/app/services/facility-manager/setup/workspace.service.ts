import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class WorkSpaceService {
  public _socket;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('workspaces');
    this._socket = _socketService.getService('workspaces');
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

  create(workspace: any) {
    return this._socket.create(workspace);
  }
  update(workspace: any) {
    return this._socket.update(workspace._id, workspace);
  }
  updateMany(workspace: any) {
    return this._socket.update(null, workspace);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
