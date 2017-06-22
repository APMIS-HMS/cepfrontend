import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class TagService {
  public listner;
  public createListener;
  public _socket;
  private _rest;
  private _restLogin;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private sanitizer: DomSanitizer,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('servicetags');
    this._socket = _socketService.getService('servicetags');
    this._restLogin = _restService.getService('auth/local');
    this.listner = Observable.fromEvent(this._socket, 'updated');
    this.createListener = Observable.fromEvent(this._socket, 'created');
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
  create(tag: any) {
    return this._socket.create(tag);
  }
  update(tag: any) {
    return this._socket.update(tag._id, tag);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}