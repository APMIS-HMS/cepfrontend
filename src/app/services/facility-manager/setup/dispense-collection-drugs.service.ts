import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';

@Injectable()
export class DispenseCollectionDrugService {
  public _socket;
  private _rest;
  public createlistner;
  public updatelistner;
  public deletedlistner;

  private invoiceAnnouncedSource = new Subject<Object>();
  invoiceAnnounced$ = this.invoiceAnnouncedSource.asObservable();

  private discountAnnouncedSource = new Subject<Object>();
  discountAnnounced$ = this.discountAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('dispensecollectiondrugs');
    this._socket = _socketService.getService('dispensecollectiondrugs');
    this._socket.timeout = 30000;
    this.createlistner = Observable.fromEvent(this._socket, 'created');
    this.updatelistner = Observable.fromEvent(this._socket, 'updated');
    this.deletedlistner = Observable.fromEvent(this._socket, 'deleted');
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

  create(drugs: any) {
    return this._socket.create(drugs);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  patch(_id: any, data: any, param: any) {
      return this._socket.patch(_id, data, param);
  }

  update(inventory: any) {
    return this._socket.update(inventory._id, inventory);
  }

}