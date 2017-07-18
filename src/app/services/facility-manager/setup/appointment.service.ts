import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';

@Injectable()
export class AppointmentService {
  public _socket;
  private _rest;

  public createlistner;
  public updatelistner;
  public deletedlistner;

  private timelineAnnouncedSource = new Subject<Object>();
  timelineAnnounced$ = this.timelineAnnouncedSource.asObservable();

  private schedulesAnnouncedSource = new Subject<Object>();
  schedulesAnnounced$ = this.schedulesAnnouncedSource.asObservable();

  private patientAnnouncedSource = new Subject<Object>();
  patientAnnounced$ = this.patientAnnouncedSource.asObservable();

  private appointmentAnnouncedSource = new Subject<Object>();
  appointmentAnnounced$ = this.appointmentAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('appointments');
    this._socket = _socketService.getService('appointments');
    this._socket.timeout = 50000;
    this.createlistner = Observable.fromEvent(this._socket, 'created');
    this.updatelistner = Observable.fromEvent(this._socket, 'updated');
    this.deletedlistner = Observable.fromEvent(this._socket, 'deleted');
    this._socket.on('created', function (gender) {
    });
  }
  hideTimelineAnnounced(show: boolean) {
    this.timelineAnnouncedSource.next(show);
  }
  hideTimelineReceived(): Observable<Object> {
    return this.timelineAnnouncedSource.asObservable();
  }

  schedulesAnnounced(shedules: any) {
    this.schedulesAnnouncedSource.next(shedules);
  }
  schedulesReceived(): Observable<Object> {
    return this.schedulesAnnouncedSource.asObservable();
  }
  patientAnnounced(patient: any) {
    this.patientAnnouncedSource.next(patient);
  }
  appointmentAnnounced(appointment: any) {
    this.appointmentAnnouncedSource.next(appointment);
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

  update(billing: any) {
    return this._socket.update(billing._id, billing);
  }

  patch(_id: any, data: any, param: any) {
    return this._socket.patch(_id, data, param);
  }
}
