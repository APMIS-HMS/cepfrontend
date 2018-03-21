import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProductService {
  public _socket;
  public _socketProductConfig;
  public _socketPackageList;
  public _socketList;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('products');
    this._socket = _socketService.getService('products');
    this._socketProductConfig = _socketService.getService('product-configs');
    this._socketPackageList = _socketService.getService('product-pack-sizes');
    this._socketList = _socketService.getService('list-of-products');
    this._socket.timeout = 30000;
    this.listenerCreate = Observable.fromEvent(this._socket, 'created');
    this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
    this.listenerDelete = Observable.fromEvent(this._socket, 'deleted');


  }

  find(query: any) {
    return this._socket.find(query);
  }

  findList(query: any) {
    return this._socketList.find(query);
  }

  findPackageSize(query: any) {
    return this._socketPackageList.find(query);
  }

  findProductConfigs(query: any) {
    return this._socketProductConfig.find(query);
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
  createProductConfig(serviceprice: any) {
    return this._socketProductConfig.create(serviceprice);
  }
  updateProductConfig(serviceprice: any) {
    return this._socketProductConfig.update(serviceprice._id, serviceprice);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
  
}
