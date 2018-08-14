import {Router} from '@angular/router';
const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');
const localstorage = require('feathers-localstorage');
const rest = require('@feathersjs/rest-client');
const authentication = require('@feathersjs/authentication-client');
import {CoolLocalStorage} from 'angular2-cool-storage';
import {Injectable} from '@angular/core';
import { API_LOCALHOST, API_DEV, API_TEST, API_LIVE } from '../shared-module/helpers/global-config';
const rx = require('feathers-reactive');
const RxJS = require('rxjs/Rx');
const CircularJSON = require('circular-json');

const HOST = API_TEST;

@Injectable()
export class SocketService {
  public socket: any;
  public HOST;
  private _app: any;

  constructor(public locker: CoolLocalStorage, private _router: Router) {
    this.HOST = HOST;
    this.socket = io(this.HOST);
    this._app = feathers()
        .configure(socketio(this.socket))
        .configure(rx(RxJS, {listStrategy: 'always'}))
        .configure(authentication({storage: window.localStorage}));
  }
  logOut() {
    this._app.logout();
    this.locker.clear();
  }

  async loginIntoApp(query: any) {
    return this._app.authenticate({strategy: 'local', email: CircularJSON.stringify(query.email), password: CircularJSON.stringify(query.password)});
  }

  getService(value: any) {
    return this._app.service(value);
  }
  authenticateService() {
    return this._app.authenticate();
  }
}

const superagent = require('superagent');
@Injectable()
export class RestService {
  public HOST;
  private _app: any;
  logOut() {
    this.locker.clear();
  }
  constructor(private locker: CoolLocalStorage, private _router: Router) {
    this.HOST = HOST;
    if (this.locker.getObject('auth') !== undefined && this.locker.getObject('auth') != null) {
      const auth: any = this.locker.getObject('token');
      this._app = feathers()
          .configure(rest(this.HOST).superagent(superagent, {headers: {authorization: 'Bearer ' + auth}}))
          .configure(rx(RxJS, {listStrategy: 'always'}))
          .configure(authentication({storage: window.localStorage}));
    } else {
      this._app = feathers()  // Initialize feathers
          .configure(rest(this.HOST).superagent(superagent))  // Fire up rest
          .configure(authentication({storage: window.localStorage}));  // Configure feathers-hooks
    }
  }
  loginIntoApp(query) {
    return this._app.authenticate({strategy: 'local', email: CircularJSON.stringify(query.email), password: CircularJSON.stringify(query.password)});
  }
  getService(value: any) {
    // this._app.authenticate();
    return this._app.service(value);
  }
  authenticateService() {
    return this._app.authenticate();
  }
  getHost() {
    return this.HOST;
  }
}
