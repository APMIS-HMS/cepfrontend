import { FeatureModuleService } from "./../../services/module-manager/setup/feature-module.service";
import { CoolLocalStorage } from "angular2-cool-storage/src/cool-local-storage";
import { SocketService } from "./../../feathers/feathers.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthFacadeService {
  logingEmployee: any;
  access: any;
  loginUser: any;
  constructor(
    private _socketService: SocketService,
    private locker: CoolLocalStorage,
    private featureService: FeatureModuleService
  ) {}

  setLogingEmployee(employee) {
    this.logingEmployee = employee;
  }

  setLoginUser(user) {
    this.loginUser = user;
  }

  getLogingEmployee() {
    let facId = this.locker.getObject("fac");
    let self = this;

    return new Promise(function(resolve, reject) {
      console.log(self.logingEmployee);
      if (self.logingEmployee !== undefined) {
        resolve(self.logingEmployee);
      } else {
        self._socketService.authenticateService();
        self._socketService
          .getService("save-employee")
          .get(facId)
          .then(
            payload => {
              if (payload !== undefined) {
                self.logingEmployee = payload.selectedEmployee;
                self.setLogingEmployee(payload.selectedEmployee);
                self.setLoginUser(payload.selectedUser);
                resolve(self.logingEmployee);
              } else {
                resolve(undefined);
              }
            },
            error => {}
          );
      }
    });
  }
  getLogingUser() {
    let facId = this.locker.getObject("fac");
    let self = this;
console.log(facId);
    return new Promise(function(resolve, reject) {
      console.log(self.loginUser);
      if (self.loginUser !== undefined) {
        console.log(1);
        resolve(self.loginUser);
      } else {
        console.log(2)
        self._socketService.authenticateService();
        self._socketService
          .getService("save-employee")
          .get(facId)
          .then(
            payload => {
              console.log(payload);
              if (payload !== undefined) {
                self.setLogingEmployee(payload.selectedEmployee);
                self.setLoginUser(payload.selectedUser);
                resolve(self.loginUser);
              } else {
                console.log(3)
                resolve(undefined);
              }
            },
            error => {}
          );
      }
    });
  }
  getUserAccessControls() {
    let facId = this.locker.getObject("fac"); // TO Do: check if fac is in user's facilityRoles
    let self = this;
    return new Promise(function(resolve, reject) {
      if (self.access !== undefined && self.access.modules !== undefined) {
        resolve(self.access);
      } else {
        self.featureService.getUserRoles({ query: { facilityId: facId } }).then(
          payload => {
            self.access = payload;
            resolve(self.access);
          },
          error => {}
        );
      }
    });
  }
}
