import { FeatureModuleService } from "./../../services/module-manager/setup/feature-module.service";
import { CoolLocalStorage } from "angular2-cool-storage/src/cool-local-storage";
import { SocketService, RestService } from "./../../feathers/feathers.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthFacadeService {
  logingEmployee: any;
  access: any;
  loginUser: any;
  private selectedFacility:any;
  constructor(
    private _socketService: SocketService,
    private _restService:RestService,
    private locker: CoolLocalStorage,
    private featureService: FeatureModuleService
  ) {}

  setLogingEmployee(employee) {
    this.logingEmployee = employee;
  }

  setLoginUser(user) {
    this.loginUser = user;
  }

  setSelectedFacility(facility) {
    this.selectedFacility = facility;
  }
  getSelectedFacility(){
    return this.selectedFacility;
  }

  getLogingEmployee() {
    let facId = this.locker.getObject("fac");
    let self = this;

<<<<<<< HEAD
    return new Promise(function (resolve, reject) {
=======
    return new Promise(function(resolve, reject) {
>>>>>>> f46dc8a6833e2c47b99bdd27cfce89d3ec6e6f23
      if (self.logingEmployee !== undefined) {
        resolve(self.logingEmployee);
      } else {
        self._socketService.authenticateService();
<<<<<<< HEAD
        self._socketService.getService('save-employee').get(facId).then(payload => {
          if (payload.data !== undefined) {
            self.logingEmployee = payload.data[0];
            self.setLogingEmployee(payload.data[0]);
            resolve(self.logingEmployee)
          } else {
            resolve(undefined)
          }

        }, error => {
        });
=======
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
>>>>>>> f46dc8a6833e2c47b99bdd27cfce89d3ec6e6f23
      }
    });
  }
<<<<<<< HEAD

  getCheckedInEmployee(id, data) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self._socketService.authenticateService();
      self._socketService.getService('employee-checkins').patch(id, data).then(payload => {
        if (payload !== null) {
          self.logingEmployee = payload;
          self.setLogingEmployee(payload);
          resolve(self.logingEmployee)
        } else {
          resolve(undefined)
        }

      }, error => {
      });


    });

  }

  getUserAccessControls() {
    let facId = this.locker.getObject('fac'); // TO Do: check if fac is in user's facilityRoles
=======
  getLogingUser() {
    let facId = this.locker.getObject("fac");
>>>>>>> f46dc8a6833e2c47b99bdd27cfce89d3ec6e6f23
    let self = this;
    return new Promise(function(resolve, reject) {
      if (self.loginUser !== undefined) {
        resolve(self.loginUser);
      } else {
        self._socketService.authenticateService();
        self._socketService
          .getService("save-employee")
          .get(facId)
          .then(
            payload => {
              if (payload !== undefined) {
                self.setLogingEmployee(payload.selectedEmployee);
                self.setLoginUser(payload.selectedUser);
                resolve(self.loginUser);
              } else {
                resolve(undefined);
              }
            },
            error => {
            }
          );
      }
    });
  }
  getUserAccessControls(force?) {
    let facId = this.locker.getObject("fac"); // TO Do: check if fac is in user's facilityRoles
    let self = this;
    return new Promise(function(resolve, reject) {
      if (self.access !== undefined && self.access.modules !== undefined && !force) {
        resolve(self.access);
      } else {
        self.featureService.getUserRoles({ query: { facilityId: facId } }).then(
          payload => {
            self.access = payload;
            self.setSelectedFacility(payload.selectedFacility);
            resolve(self.access);
          },
          error => {
          }
        );
      }
    });
  }
}
