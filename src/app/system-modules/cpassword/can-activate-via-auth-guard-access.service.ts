import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';

import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { RouterStateSnapshot } from "@angular/router/src/router_state";
import { DONT_USE_AUTH_GUARD } from "../../shared-module/helpers/global-config";

@Injectable()
export class CanActivateViaAuthGuardAccessService implements CanActivate {
  constructor(private authFacadeService: AuthFacadeService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.authFacadeService.getLogingEmployee;
      self.authFacadeService.getUserAccessControls().then(
        (payload: any) => {
          let modules: any = payload.modules;
          const index = modules.findIndex(
            x => x.moduleName.toLowerCase() === route.routeConfig.path
          );
          const facility = self.authFacadeService.getSelectedFacility();
          const validate = self.validateFacility(facility);
          const resulm = (index > -1 || DONT_USE_AUTH_GUARD) &&
          (validate || route.routeConfig.path === "facility");
          resolve(
            (index > -1 || DONT_USE_AUTH_GUARD) &&
              (validate || route.routeConfig.path === "facility")
          );
        },
        error => {
          reject(error);
        }
      );
    });
  }
  validateFacility(facility) {
    const result =
      facility.isValidRegistration === undefined ||
      facility.isValidRegistration === false
        ? false
        : true;
    return result;
  }
}

