import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LaboratoryRequestService {
  public _socket;
  private _rest;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('laboratoryrequests');
    this._socket = _socketService.getService('laboratoryrequests');
     this._socket.timeout = 90000;
    this._socket.on('created', function (laboratoryrequests) {

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

  create(laboratoryrequest: any) {
    return this._socket.create(laboratoryrequest);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  update(laboratoryrequest: any) {
    return this._rest.update(laboratoryrequest._id, laboratoryrequest);
  }
}
