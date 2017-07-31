import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class OrderStatusService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('orderstatuses');
    this._socket = _socketService.getService('orderstatuses');
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

  create(status: any) {
    return this._socket.create(status);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}
