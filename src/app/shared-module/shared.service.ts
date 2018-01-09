import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedService {
  private newFormAnnouncedSource = new Subject<Object>();
  newFormAnnounced$ = this.newFormAnnouncedSource.asObservable();

  private submitFormSource = new Subject<Object>();
  submitForm$ = this.submitFormSource.asObservable();


  private announceTemplateSource = new Subject<Object>();
  announceTemplate$ = this.announceTemplateSource.asObservable();

  private announceOrderSetSource = new Subject<Object>();
  announceOrderSetSource$ = this.announceOrderSetSource.asObservable();
  private announceDiagnosisSystemOrderSource = new Subject<Object>();
  announceDiagnosisSystemOrder$ = this.announceDiagnosisSystemOrderSource.asObservable();

  constructor() { }

  announceTemplate(temp: Object) {
    this.announceTemplateSource.next(temp);
  }

  announceDiagnosisSystemOrder(temp: Object) {
    this.announceDiagnosisSystemOrderSource.next(temp);
  }

  announceNewForm(form: Object) {
    console.log(form);
    this.newFormAnnouncedSource.next(form);
  }

  announceOrderSet(orderSet) {
    this.announceOrderSetSource.next(orderSet);
  }

  submitForm(form: Object) {
    this.submitFormSource.next(form);
  }
}
