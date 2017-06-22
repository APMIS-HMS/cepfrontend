import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PrescriptionService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('prescriptions');
    this._socket = _socketService.getService('prescriptions');
    this._socket.on('created', function (gender) {
    });
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

  create(prescription: any) {
    return this._socket.create(prescription);
  }

  update(prescription: any) {
    return this._socket.update(prescription._id, prescription);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}