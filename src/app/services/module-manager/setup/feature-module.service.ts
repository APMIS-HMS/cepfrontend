import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class FeatureModuleService {
  public _socket;
  private _rest;
  private _roleSocket;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    // this._rest = _restService.getService('featuremodules');
    this._rest = _restService.getService('features');
    this._socket = _socketService.getService('features');
    this._roleSocket = _socketService.getService('facility-roles');
    this._socket.timeout = 30000;
    this._roleSocket.timeout = 30000;
    this._socket.on('created', function (features) {
    });
    this._roleSocket.on('created', function (features) {});
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

  create(features: any) {
    return this._socket.create(features);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  getFacilityRoles(id: string, query: any){
    return this._roleSocket.get(id, query);
  }

  assignUserRole(data){
    return this._roleSocket.create(data);
  }

}
