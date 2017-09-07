import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
const request = require('superagent');

@Injectable()
export class FacilitiesService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;

  private sliderAnnouncedSource = new Subject<Object>();
  sliderAnnounced$ = this.sliderAnnouncedSource.asObservable();

  private notificationAnnouncedSource = new Subject<Object>();
  notificationAnnounced$ = this.notificationAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private sanitizer: DomSanitizer,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('facilities');
    this._socket = _socketService.getService('facilities');
    this._socket.timeout = 30000;
    this._restLogin = _restService.getService('auth/local');
    this.listner = Observable.fromEvent(this._socket, 'updated');
  }
  announceSlider(slider: Object) {
    this.sliderAnnouncedSource.next(slider);
  }
  receiveSlider(): Observable<Object> {
    return this.sliderAnnouncedSource.asObservable();
  }
  announceNotification(notification: Object) {
    this.notificationAnnouncedSource.next(notification);
  }
  transform(url) {
    url = this._restService.getHost() + '/' + url + '?';// + new Date().getTime();
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
    const facility = <any>this.locker.getObject('selectedFacility');
    return facility;
  }
  getLoginUserId() {
    const auth: any = this.locker.getObject('auth');
    if (auth !== undefined) {
      const userId = auth._id;
      return userId;
    }
    return '';
  }
  create(facility: any) {
    return this._socket.create(facility);
  }
  update(facility: any) {
    return this._socket.update(facility._id, facility);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
  trimEmployee(loginEmployee) {
    const logEmp: any = loginEmployee;
    delete logEmp.department;
    delete logEmp.employeeFacilityDetails;
    delete logEmp.role;
    delete logEmp.units;
    delete logEmp.consultingRoomCheckIn;
    delete logEmp.storeCheckIn;
    delete logEmp.unitDetails;
    delete logEmp.professionObject;
    delete logEmp.workSpaces;
    delete logEmp.employeeDetails.countryItem;
    delete logEmp.employeeDetails.homeAddress;
    delete logEmp.employeeDetails.gender;
    delete logEmp.employeeDetails.maritalStatus;
    delete logEmp.employeeDetails.nationality;
    delete logEmp.employeeDetails.nationalityObject;
    delete logEmp.employeeDetails.nextOfKin;
    return logEmp;
  }
  upload(formData, id) {
    const host = this._restService.getHost();
    const path = host + '/uploadexcel';
    return request
    .post(path)
    .send(formData);
  }
}
