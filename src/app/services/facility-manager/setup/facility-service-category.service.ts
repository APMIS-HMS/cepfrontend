import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';

const request = require('superagent');

@Injectable()
export class FacilitiesServiceCategoryService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;
  public createListener;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private sanitizer: DomSanitizer,
    private locker: CoolLocalStorage,
    private _http: Http
  ) {
    this._rest = _restService.getService('facilityservices');
    this._socket = _socketService.getService('facilityservices');
    this._socket.timeout = 30000;
    this.createListener = Observable.fromEvent(this._socket, 'created');
    this.listner = Observable.fromEvent(this._socket, 'updated');
  }
  transform(url) {
    url = this._restService.getHost() + '/' + url + '?' + new Date().getTime();
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
    const facility =  <any> this.locker.getObject('selectedFacility');
    return facility;
  }
  create(facilityservice: any) {
    return this._socket.create(facilityservice);
  }
  update(facilityservice: any) {
    return this._socket.update(facilityservice._id, facilityservice);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
  searchCategory(facilityId: string, searchText: string) {
    const host = this._restService.getHost();
    const path = host + '/category';
    return request
      .get(path)
      .query({ facilityid: facilityId, searchtext: searchText });
  }

  public searchProcedure(payload: string): Promise<any> {
    const host = this._restService.getHost() + '/procedure-search';
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http.get(host, payload).toPromise()
      .then((res) => this.extractData(res)).catch(error => this.handleErrorPromise(error));
  }

  private extractData(res: Response) {
    console.log(res);
    let body = res.json();
    return body || {};
  }

  private handleErrorObservable(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} ${error.statusText || ''} - ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

  private handleErrorPromise(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} ${error.statusText || ''} - ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Promise.reject(errMsg);
  }
}
