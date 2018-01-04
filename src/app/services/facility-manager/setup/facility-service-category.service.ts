import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';

const request = require('superagent');

@Injectable()
export class FacilitiesServiceCategoryService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;
  public createListener;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private sanitizer: DomSanitizer,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('organisation-services');
    this._socket = _socketService.getService('organisation-services');
    this._socket.timeout = 30000;
    this.createListener = Observable.fromEvent(this._socket, 'created');
    this.listner = Observable.fromEvent(this._socket, 'updated');
  }
  transform(url) {
    url = this._restService.getHost() + '/' + url + '?' + new Date().getTime();
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
  getSelectedFacilityId() {
    const facility =  <any> this.locker.getObject('selectedFacility');
    return facility;
  }
  create(facilityservice: any) {
    return this._socket.create(facilityservice);
  }
  update(facilityservice: any) {
    return this._socket.update(facilityservice._id, facilityservice);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
  searchCategory(facilityId: string, searchText: string) {
    const host = this._restService.getHost();
    const path = host + '/category';
    return request
      .get(path)
      .query({ facilityid: facilityId, searchtext: searchText });
  }
}
