import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Injectable()
export class CanActivateViaAuthGuardService implements CanActivate {

  constructor(private locker: CoolSessionStorage) { }

  canActivate() {
    let auth = this.locker.getObject('auth');
    if (auth !== undefined && auth != null) {
      return true;
    }
    return false;
  }
}
