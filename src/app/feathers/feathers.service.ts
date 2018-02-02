import { Router } from '@angular/router';
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
// const HOST = 'http://13.84.217.251:8082'; // thn
//const HOST = 'http://172.16.16.62:3031'; // Mr Segun
// const HOST = 'http://40.68.100.29:3030'; // Online
//const HOST = 'http://192.168.40.233:3031'; // Sunday
const HOST = 'http://localhost:3031'; // Local Server



@Injectable()
export class SocketService {
  public socket: any;
  public HOST;
  private _app: any;

  errorHandler = error => {
    console.log('auth error')
    this._app.authenticate({
      strategy: 'local',
      email: 'admin@feathersjs.com',
      password: 'admin'
    }).then(response => {
      // You are now authenticated again
    });
  };

  constructor(public locker: CoolLocalStorage, private _router:Router) {
    this.HOST = HOST;
    this.socket = io(this.HOST);
    this._app = feathers()
      .configure(socketio(this.socket))
      // .configure(rx({ idField: "_id", listStrategy: 'always' }))
      .configure(rx(RxJS, { listStrategy: 'always' }))
      .configure(hooks())
      .configure(authentication({ storage: window.localStorage }));
     this._app.on('reauthentication-error', this.errorHandler)
  }
  logOut() {
    this._app.logout();
    this.locker.clear();
  }
  loginIntoApp(query: any) {
    return this._app.authenticate({
      "strategy": 'local',
      'email': query.email,
      'password': query.password
    });
  }
  getService(value: any) {
    // this._app.authenticate();
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
  constructor(private locker: CoolLocalStorage, private _router:Router) {
    this.HOST = HOST;
    if (this.locker.getObject('auth') !== undefined && this.locker.getObject('auth') != null) {
      const auth: any = this.locker.getObject('token')
      this._app = feathers()
        .configure(rest(this.HOST).superagent(superagent,
          {
            headers: { 'authorization': 'Bearer ' + auth }
          }
        )) // Fire up rest
        // .configure(rx({ idField: '_id', listStrategy: 'always' }))
        .configure(rx(RxJS, { listStrategy: 'always' }))
        .configure(hooks())
        .configure(authentication({ storage: window.localStorage }));
    } else {
      this._app = feathers() // Initialize feathers
        .configure(rest(this.HOST).superagent(superagent)) // Fire up rest
        .configure(hooks())
        .configure(authentication({ storage: window.localStorage })); // Configure feathers-hooks
    }
  }
  loginIntoApp(query) {
    console.log(query);
    return this._app.authenticate({
      "strategy": 'local',
      'email': query.email,
      'password': query.password
    });
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