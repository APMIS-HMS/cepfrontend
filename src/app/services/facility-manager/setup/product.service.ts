import { Subject } from 'rxjs/Subject';
import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ProductPackSize } from 'app/system-modules/module-menu/apmis-store/store-utils/global';

@Injectable()
export class ProductService {
  public _socket;
  public _socketProductConfig;
  public _socketPackageList;
  public _socketList;
  public _socketReorderLevel;
  public _socketProductUniqueReorders;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  private productSubject = new Subject<any[]>();
  private packSubject: BehaviorSubject<string> = new BehaviorSubject('');
  private elEventListerner = new Subject<string>();
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('products');
    this._socket = _socketService.getService('formulary-products');
    this._socketProductConfig = _socketService.getService('product-configs');
    this._socketPackageList = _socketService.getService('product-pack-sizes');
    this._socketList = _socketService.getService('list-of-products');
    this._socketReorderLevel = _socketService.getService('product-reorders');
    this._socketProductUniqueReorders = _socketService.getService('product-unique-reorders');
    this._socket.timeout = 50000;
    this._socketProductUniqueReorders.timeout = 50000;
    this._socketProductConfig.timeout = 50000;
    this._socketReorderLevel.timeout = 50000;
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
  createPackageSize(packageSize: any) {
    return this._socketPackageList.create(packageSize);
  }
  patchProductConfig(_id: any, obj: any, params) {
    return this._socketProductConfig.patch(_id, obj, params);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  findReorderUnique(query: any) {
    return this._socketProductUniqueReorders.find(query);
  }
  findReorder(query: any) {//_socketProductUniqueReorders
    return this._socketReorderLevel.find(query);
  }
  getReorder(id: string, query: any) {
    return this._socketReorderLevel.get(id, query);
  }

  createReorder(serviceprice: any) {
    return this._socketReorderLevel.create(serviceprice);
  }
  patchReorder(id, serviceprice: any) {
    return this._socketReorderLevel.patch(id, serviceprice);
  }
  removeReorder(id: string, query: any) {
    return this._socketReorderLevel.remove(id, query);
  }
}


