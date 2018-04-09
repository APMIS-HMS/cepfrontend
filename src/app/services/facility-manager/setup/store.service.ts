import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StoreService {
  public _socket;
  public _socket_list;
  public _statisticsSocket;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('stores');
    this._socket = _socketService.getService('stores');
    this._socket_list = _socketService.getService('list-of-stores');
    this._statisticsSocket = _socketService.getService('store-statistics');
    this._socket.timeout = 30000;
    this._socket_list.timeout = 30000;
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

  create(serviceprice: any) {
    return this._socket.create(serviceprice);
  }
  update(serviceprice: any) {
    return this._socket.update(serviceprice._id, serviceprice);
  }
  patch(id,serviceprice: any) {
    return this._socket.patch(id, serviceprice);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  getList(id: string, query: any) {
    return this._socket_list.get(id, query);
  }

  getStat(data: any, query: any) {
    return this._statisticsSocket.get(data, query);
  }
}
