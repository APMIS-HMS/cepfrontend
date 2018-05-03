import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class CanActivateViaAuthGuardService implements CanActivate {

  constructor(private locker: CoolLocalStorage, private authFacadeService: AuthFacadeService) { }

  canActivate() {
    const auth = this.authFacadeService.getAuth(); //this.locker.getObject('auth');
    if (auth !== undefined && auth != null) {
      return true;
    }
    console.log(false);
    return false;
  }
}
