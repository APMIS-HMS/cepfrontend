import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

const request = require('superagent');

@Injectable()
export class EmployeeService {
  public _socket;
  private _rest;
  public listner;
  public createListener;

  private checkInAnnouncedSource = new Subject<any>();
  checkInAnnounced$ = this.checkInAnnouncedSource.asObservable();

  private employeeAnnouncedSource = new Subject<any>();
  employeeAnnounced$ = this.employeeAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('employees');
    this._socket = _socketService.getService('employees');
    this._socket.timeout = 30000;
    this.createListener = Observable.fromEvent(this._socket, 'created');
    this.listner = Observable.fromEvent(this._socket, 'updated');
  }
  announceCheckIn(checkIn: any) {
    this.checkInAnnouncedSource.next(checkIn);
  }

  announceEmployee(employee: any) {
    this.employeeAnnouncedSource.next(employee);
  }

  InitializeEvent(event) {
    const observable = new Observable(observer => {
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
  find(query: any) {
    return this._rest.find(query);
  }

  findAll() {
    return this._rest.find();
  }
  get(id: string, query: any) {
    return this._rest.get(id, query);
  }

  create(employee: any) {
    return this._rest.create(employee);
  }

  remove(id: string, query: any) {
    return this._rest.remove(id, query);
  }
  update(employee: any) {
    return this._rest.update(employee._id, employee);
  }
  updateMany(employees: any) {
    return this._rest.update('employees._id', employees);
  }
  patchMany(data: any, param: any) {
    return this._rest.patch(null, data, param);
  }
  searchEmployee(facilityId: string, searchText: string, showbasicinfo: boolean) {
    console.log('inin')
    const host = this._restService.getHost();
    const path = host + '/employee';
    return request
      .get(path)
      .query({ facilityid: facilityId, searchtext: searchText, showbasicinfo }); // query string 
  }

}
