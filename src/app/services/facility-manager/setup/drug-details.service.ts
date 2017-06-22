import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class DrugDetailsApiService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('drug-details-api');
    this._socket = _socketService.getService('drug-details-api');
    this._socket.on('created', function (drug) {
    });
  }

  find(query: any) {
    return this._rest.find(query);
  }

  findAll() {
    return this._socket.find();
  }
  get(id: string, query: any) {
    return this._socket.get(id, query);
  }

  create(drug: any) {
    return this._socket.create(drug);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}
