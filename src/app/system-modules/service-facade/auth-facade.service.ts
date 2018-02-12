import { FeatureModuleService } from './../../services/module-manager/setup/feature-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage/src/cool-local-storage';
import { SocketService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthFacadeService {

  logingEmployee: any;
  access: any;
  constructor(private _socketService: SocketService, private locker: CoolLocalStorage, private featureService: FeatureModuleService, ) { }

  setLogingEmployee(employee) {
    this.logingEmployee = employee
  }

  getLogingEmployee() {
    let facId = this.locker.getObject('fac');
    let self = this;

    return new Promise(function (resolve, reject) {
      console.log(1);
      if (self.logingEmployee !== undefined) {
        console.log(2);
        resolve(self.logingEmployee);
      } else {
        console.log(3);
        self._socketService.authenticateService();
        console.log(4);
        self._socketService.getService('save-employee').get(facId).then(payload => {
          console.log(5);
          if (payload.data !== undefined) {
            self.logingEmployee = payload.data[0];
            self.setLogingEmployee(payload.data[0]);
            resolve(self.logingEmployee)
          } else {
            resolve(undefined)
          }

        }, error => {
        });
      }


    });

  }

  getCheckedInEmployee(id, data) {
    let self = this;
    return new Promise(function (resolve, reject) {
      console.log(1);
      self._socketService.authenticateService();
      self._socketService.getService('employee-checkins').patch(id, data).then(payload => {
        console.log(payload);
        console.log(" PATCHED");
        if (payload !== null) {
          self.logingEmployee = payload;
          self.setLogingEmployee(payload);
          resolve(self.logingEmployee)
        } else {
          resolve(undefined)
        }

      }, error => {
        console.log(error);
      });


    });

  }

  getUserAccessControls() {
    let facId = this.locker.getObject('fac'); // TO Do: check if fac is in user's facilityRoles
    let self = this;
    return new Promise(function (resolve, reject) {
      if (self.access !== undefined && self.access.modules !== undefined) {
        resolve(self.access);
      } else {
        self.featureService.getUserRoles({ query: { facilityId: facId } }).then(payload => {
          self.access = payload;
          resolve(self.access);
        }, error => {
        });
      }
    });
  }
}