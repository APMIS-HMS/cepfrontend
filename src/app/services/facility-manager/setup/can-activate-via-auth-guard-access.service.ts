import { DONT_USE_AUTH_GUARD } from './../../../shared-module/helpers/global-config';
import { AuthFacadeService } from './../../../system-modules/service-facade/auth-facade.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router/src/router_state';

@Injectable()
export class CanActivateViaAuthGuardAccessService implements CanActivate {

  constructor(private authFacadeService: AuthFacadeService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.authFacadeService.getUserAccessControls().then((payload: any) => {
        let modules: any = payload.modules;
        const index = modules.findIndex(x => x.moduleName.includes(route.routeConfig.path));
        resolve(index > -1 || DONT_USE_AUTH_GUARD);
      }, error => {
        reject(error);
      });
    });

  }
}
