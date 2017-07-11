import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';

@Injectable()
export class AssessmentDispenseService {
  public _socket;
  private _rest;

  public createlistner;
  public updatelistner;
  public deletedlistner;

  private timelineAnnouncedSource = new Subject<Object>();
  timelineAnnounced$ = this.timelineAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('assessmentdispense');
    this._socket = _socketService.getService('assessmentdispense');
    this._socket.timeout = 50000;
    this.createlistner = Observable.fromEvent(this._socket, 'created');
    this.updatelistner = Observable.fromEvent(this._socket, 'updated');
    this.deletedlistner = Observable.fromEvent(this._socket, 'deleted');
    this._socket.on('created', function (dispenseassessments) {
    });
  }
  hideTimelineAnnounced(show: true) {
    this.timelineAnnouncedSource.next(show);
  }
  hideTimelineReceived(): Observable<Object> {
    return this.timelineAnnouncedSource.asObservable();
  }
  find(query: any) {
    return this._rest.find(query);
  }

  findAll() {
    return this._socket.find();
  }
  get(id: string, query: any) {
    return this._socket.get(id, query);
  }

  create(assessmentdispense: any) {
    return this._socket.create(assessmentdispense);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  update(assessmentdispense: any) {
    return this._socket.update(assessmentdispense._id, assessmentdispense);
  }

  patch(_id: any, data: any, param: any) {
    return this._socket.patch(_id, data, param);
  }
}
