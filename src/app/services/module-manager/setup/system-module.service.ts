import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class SystemModuleService {

  private loadingAnnouncedSource = new Subject<Object>();
  loadingAnnounced$ = this.loadingAnnouncedSource.asObservable();

  private broadCastOnlineSource = new Subject<Object>();
  broadCastOnlineSource$ = this.broadCastOnlineSource.asObservable();

  private loggedInUserAnnouncedSource = new Subject<Object>();
  loggedInUserAnnounced = this.loggedInUserAnnouncedSource.asObservable();

  constructor() {
  }
  announceLoading(notification: Object) {
    this.loadingAnnouncedSource.next(notification);
  }



  announceLoggedInUser(userObject: Object) {
    this.loggedInUserAnnouncedSource.next(userObject);
  }

  onlineStatusBroadCast(status: Object) {
    this.broadCastOnlineSource.next(status);
  }
  off() {
    this.announceLoading({ status: 'Off' });
  }
  on() {
    this.announceLoading({ status: 'On' });
  }
}