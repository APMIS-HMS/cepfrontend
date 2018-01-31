import { CoolLocalStorage } from 'angular2-cool-storage/src/cool-local-storage';
import { SocketService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthFacadeService {

  logingEmployee: any;
  constructor(private _socketService: SocketService, private locker: CoolLocalStorage) { }

  setLogingEmployee(employee) {
    this.logingEmployee = employee
  }

   getLogingEmployee() {
    if (this.logingEmployee === undefined) {
      let facId = this.locker.getObject('fac');
      let self = this;
      return new Promise(function (resolve, reject) {
        self._socketService.getService('save-employee').get(facId).then(payload =>{
          console.log(payload)
          self.logingEmployee = payload.data[0];
          resolve(self.logingEmployee)
        });
      });
      
    }else{
      console.log('not going');
      let self = this;
      return new Promise(function (resolve, reject) {
        resolve(self.logingEmployee);
      });
    }
    
  }
}
