import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';

@Injectable()
export class InventoryService {
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
    this._rest = _restService.getService('inventories');
    this._socket = _socketService.getService('inventories');
    this._socket.timeout = 30000;
    this.createlistner = Observable.fromEvent(this._socket, 'created');
    this.updatelistner = Observable.fromEvent(this._socket, 'updated');
    this.deletedlistner = Observable.fromEvent(this._socket, 'deleted');
  }
  announceInvoice(invoice: Object) {
    this.invoiceAnnouncedSource.next(invoice);
  }
  receiveInvoice(): Observable<Object> {
    return this.invoiceAnnouncedSource.asObservable();
  }

  announceDiscount(discount: Object) {
    this.discountAnnouncedSource.next(discount);
  }
  receiveDiscount(): Observable<Object> {
    return this.discountAnnouncedSource.asObservable();
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

  create(gender: any) {
    return this._socket.create(gender);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  update(inventory: any) {
    return this._socket.update(inventory._id, inventory);
  }

}