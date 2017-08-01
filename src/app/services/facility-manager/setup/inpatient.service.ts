import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class InPatientService {
  public _socket;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  private inPatientItem;

  private missionAnnouncedSource = new Subject<any>();
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private sanitizer: DomSanitizer,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('inpatients');
    this._socket = _socketService.getService('inpatients');
    this._socket.timeout = 50000;
    this.listenerCreate = Observable.fromEvent(this._socket, 'created');
    this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
    this.listenerDelete = Observable.fromEvent(this._socket, 'deleted');

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

  create(inpatient: any) {
    return this._socket.create(inpatient);
  }
  update(inpatient: any) {
    return this._socket.update(inpatient._id, inpatient);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  announceMission(mission: any) {
    this.missionAnnouncedSource.next(mission);
  }

  getAnnounceMission() {
    return this.inPatientItem;

  }
}
