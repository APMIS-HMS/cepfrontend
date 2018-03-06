import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class InvestigationService {
  public _socket;
  private _rest;
  public listner;
  public createListener;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('investigations');
    this._socket = _socketService.getService('investigations');
     this._socket.timeout = 10000;
    // this._socket.on('created', function (investigations) {

    // });
    this.createListener = Observable.fromEvent(this._socket, 'created');
    this.listner = Observable.fromEvent(this._socket, 'updated');
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

  create(investigation: any) {
    return this._socket.create(investigation);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  update(investigation: any) {
    return this._socket.update(investigation._id, investigation);
  }
}
