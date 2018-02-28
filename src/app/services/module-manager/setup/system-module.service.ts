import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class SystemModuleService {

  private loadingAnnouncedSource = new Subject<Object>();
  loadingAnnounced$ = this.loadingAnnouncedSource.asObservable();

  private sweetAnnouncedSource = new Subject<Object>();
  sweetAnnounced$ = this.sweetAnnouncedSource.asObservable();

  private broadCastOnlineSource = new Subject<Object>();
  broadCastOnlineSource$ = this.broadCastOnlineSource.asObservable();

  private loggedInUserAnnouncedSource = new Subject<Object>();
  loggedInUserAnnounced = this.loggedInUserAnnouncedSource.asObservable();

  private messageSource = new BehaviorSubject<Object>(false);
  currentMessage = this.messageSource.asObservable();

  constructor() {
  }
  announceLoading(loading: Object) {
    this.loadingAnnouncedSource.next(loading);
  }
  private announceSweet(notification: Object) {
    this.sweetAnnouncedSource.next(notification);
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
  announceSweetProxy(title, type, cp?, html?, text?, from?, position?, showConfirmButton?, timer?) {
    this.announceSweet({
      title: title,
      type: type,
      cp,
      html: html,
      text: text,
      from: from,
      position: position,
      showConfirmButton: showConfirmButton,
      timer: timer
    });
  }

  changeMessage(message: Object) {
    this.messageSource.next(message);
  }

}
