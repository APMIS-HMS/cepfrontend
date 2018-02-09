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
      console.log(self.logingEmployee);
      if (self.logingEmployee !== undefined) {
        let n = self.logingEmployee.storeCheckIn.length;
        console.log(n);
        resolve(self.logingEmployee);
      } else {
        self._socketService.authenticateService();
        self._socketService.getService('save-employee').get(facId).then(payload => {
          if(payload.data !== undefined){
            self.logingEmployee = payload.data[0];
            self.setLogingEmployee(payload.data[0]);
            resolve(self.logingEmployee)
          }else{
            resolve(undefined)
          }
          
        }, error => {
        });
      }


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