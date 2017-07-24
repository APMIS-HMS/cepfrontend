import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedService {
  private newFormAnnouncedSource = new Subject<Object>();
  newFormAnnounced$ = this.newFormAnnouncedSource.asObservable();

  private submitFormSource = new Subject<Object>();
  submitForm$ = this.submitFormSource.asObservable();

  constructor() { }

  announceNewForm(form: Object) {
    this.newFormAnnouncedSource.next(form);
  }

  submitForm(form: Object) {
    this.submitFormSource.next(form);
  }
}
