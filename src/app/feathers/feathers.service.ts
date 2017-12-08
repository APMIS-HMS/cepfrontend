const feathers = require('feathers/client');
const socketio = require('feathers-socketio/client');
const io = require('socket.io-client');
const localstorage = require('feathers-localstorage');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest/client');
const authentication = require('feathers-authentication/client');
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Injectable } from '@angular/core';
const rx = require('feathers-reactive');
const RxJS = require('rxjs/Rx');

 // const HOST = 'http://172.16.16.47:3030'; // Online
// const HOST = 'http://192.168.20.101:3030'; // Sunday
const HOST = 'http://localhost:3030'; // Local Server

@Injectable()
export class SocketService {
  public socket: any;
  public HOST;
  private _app: any;
  constructor(public locker: CoolLocalStorage) {
    this.HOST = HOST;
    this.socket = io(this.HOST);
    this._app = feathers()
      .configure(socketio(this.socket))
      .configure(rx(RxJS, { listStrategy: 'always' }))
      .configure(hooks())
      .configure(authentication({ storage: window.localStorage }));
  }
  logOut() {
    this._app.logout();
    this.locker.clear();
  }
  loginIntoApp(query: any) {
    return this._app.authenticate({
      type: 'local',
      'email': query.email,
      'password': query.password
    });
  }
  getService(value: any) {
    return this._app.service(value);
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
  constructor(private locker: CoolLocalStorage) {
    this.HOST = HOST;
    if (this.locker.getObject('auth') !== undefined && this.locker.getObject('auth') != null) {
      const auth: any = this.locker.getObject('auth')
      this._app = feathers()
        .configure(rest(this.HOST).superagent(superagent,
          {
            headers: { 'authorization': 'Bearer ' + auth.token }
          }
        )) // Fire up rest
        .configure(rx(RxJS, { listStrategy: 'always' }))
        .configure(hooks())
        .configure(authentication());
    } else {
      this._app = feathers() // Initialize feathers
        .configure(rest(this.HOST).superagent(superagent)) // Fire up rest
        .configure(hooks())
        .configure(authentication()); // Configure feathers-hooks
    }
  }
  loginIntoApp(query) {
    return this._app.authenticate({
      type: 'local',
      'email': query.email,
      'password': query.password
    });
  }
  getService(value: any) {
    return this._app.service(value);
  }
  getHost() {
    return this.HOST;
  }
}
