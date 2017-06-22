import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';
import {  Patient } from '../../../models/index';
let request = require('superagent');

@Injectable()
export class PatientService {
  public _socket;
  private _rest;
  public listner;
  public createListener;

  private patientAnnouncedSource = new Subject<Patient>();
  patientAnnounced$ = this.patientAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('patients');
    this._socket = _socketService.getService('patients');
    this._socket.timeout = 30000;
    this.createListener = Observable.fromEvent(this._socket, 'created');
    this.listner = Observable.fromEvent(this._socket, 'updated');
  }
  announcePatient(patient: Patient) {
    this.patientAnnouncedSource.next(patient);
  }
  receivePatient(): Observable<Patient> {
    return this.patientAnnouncedSource.asObservable();
  }
  InitializeEvent(event) {
    let observable = new Observable(observer => {
      this._socket.on(event, (data) => {
        observer.next(data);
      });
      return () => {
        this._socket.disconnect();
      };
    });
    return observable;
  }
  RxfromIO(io, eventName) {
    return Observable.create(observer => {
      io.on(eventName, (data) => {
        observer.onNext(data);
      });
      return {
        dispose: io.close
      };
    });
  }
  reload() {
    //this._restService.reload();
  }
  find(query: any) {
    this.reload();
    return this._socket.find(query);
  }

  findAll() {
    this.reload();
    return this._socket.find();
  }
  get(id: string, query: any) {
    this.reload();
    return this._socket.get(id, query);
  }

  create(patient: any) {
    return this._socket.create(patient);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
  update(patient: any) {
    return this._socket.update(patient._id, patient);
  }
  searchPatient(facilityId: string, searchText: string) {
    // path = 'http://localhost:3030/patient?facilityid=5859041abf87fb1918b5c256&searchtext=Rebecca';
    let host = this._restService.getHost();
    let path = host + '/patient';
    return request
      .get(path)
      .query({ facilityid: facilityId, searchtext: searchText }); // query string 
  }

}
