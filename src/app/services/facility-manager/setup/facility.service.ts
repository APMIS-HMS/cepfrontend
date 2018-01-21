import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
const request = require('superagent');

@Injectable()
export class FacilitiesService {
  public listner;
  public patchListner;
  public _socket;
  public _saveFacilitySocket;
  public _sendFacilityTokenSocket;
  private _rest;
  private _restLogin;
  private _socketNetwork;

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
    this._socket = _socketService.getService('facilities')
    this._saveFacilitySocket = _socketService.getService('save-facility');
    this._sendFacilityTokenSocket = _socketService.getService('resend-token');
    this._socket.timeout = 30000;
    this._restLogin = _restService.getService('auth/local');
    this.listner = Observable.fromEvent(this._socket, 'updated');
    this.patchListner = Observable.fromEvent(this._socket, 'patched');
    this._socketNetwork = _socketService.getService('add-network');
    this._socketNetwork.timeout = 30000;
    // client.service('messages').on('created', addMessage);

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
  createFacility(facility: any) {
    let that = this;
    return new Promise(function (resolve, reject) {
      resolve(that._saveFacilitySocket.create(facility))
    });
  }

  resendToken(facilityId: any) {
    let that = this;
    return new Promise(function (resolve, reject) {
      resolve(that._sendFacilityTokenSocket.create(facilityId));
    });
  }
  update(facility: any) {
    return this._socket.update(facility._id, facility);
  }
  patch(_id: any, data: any, param: any) {
    return this._socket.patch(_id, data, param);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
  trimEmployee(loginEmployee) {
    const logEmp: any = loginEmployee;
    if (logEmp !== null && logEmp.department !== undefined) {
      delete logEmp.department;
    }
    if (logEmp !== null && logEmp.professionObject !== undefined) {
      delete logEmp.professionObject;
    }
    if (logEmp !== null && logEmp.employeeDetails.countryItem !== undefined) {
      delete logEmp.employeeDetails.countryItem;
    }
    if (logEmp !== null && logEmp.wardCheckIn !== undefined) {
      delete logEmp.wardCheckIn;
    }
    if (logEmp !== null && logEmp.workbenchCheckIn !== undefined) {
      delete logEmp.workbenchCheckIn;
    }
    if (logEmp !== null && logEmp.workSpaces !== undefined) {
      delete logEmp.workSpaces;
    }
    if (logEmp !== null && logEmp.employeeDetails.homeAddress !== undefined) {
      delete logEmp.employeeDetails.homeAddress;
    }
    if (logEmp !== null && logEmp.employeeDetails.gender !== undefined) {
      delete logEmp.employeeDetails.gender;
    }
    if (logEmp !== null && logEmp.employeeDetails.maritalStatus !== undefined) {
      delete logEmp.employeeDetails.maritalStatus;
    }
    if (logEmp !== null && logEmp.employeeDetails.countryItem !== undefined) {
      delete logEmp.employeeDetails.countryItem;
    }
    if (logEmp !== null && logEmp.employeeDetails.nationalityObject !== undefined) {
      delete logEmp.employeeDetails.nationalityObject;
    }
    if (logEmp !== null && logEmp.employeeDetails.nextOfKin !== undefined) {
      delete logEmp.employeeDetails.nextOfKin;
    }
    if (logEmp !== null && logEmp.unitDetails !== undefined) {
      delete logEmp.unitDetails;
    }
    if (logEmp !== null && logEmp.storeCheckIn !== undefined) {
      delete logEmp.storeCheckIn;
    }
    if (logEmp !== null && logEmp.consultingRoomCheckIn !== undefined) {
      delete logEmp.consultingRoomCheckIn;
    }
    if (logEmp !== null && logEmp.units !== undefined) {
      delete logEmp.units;
    }
    if (logEmp !== null && logEmp.role !== undefined) {
      delete logEmp.role;
    }
    if (logEmp !== null && logEmp.employeeFacilityDetails !== undefined) {
      delete logEmp.employeeFacilityDetails;
    }
    return logEmp;
  }
  upload(formData, id) {
    const host = this._restService.getHost();
    const path = host + '/uploadexcel';
    return request
      .post(path)
      .send(formData);
  }
  post(body: any, params: any) {
    const host = this._socketService.HOST;
    const path = host + '/add-networks';
    return request
      .post(path)
      .send(body);
  }

  addNetwork(netw: any){
    return this._socketNetwork.create(netw);
  }
}
