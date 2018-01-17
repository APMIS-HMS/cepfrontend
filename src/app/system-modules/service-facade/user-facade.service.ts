import { SocketService } from './../../feathers/feathers.service';
import { User } from './../../models/facility-manager/setup/user';
import { Injectable } from '@angular/core';

@Injectable()
export class UserFacadeService {
  private user: User;
  constructor(private _socketService: SocketService, ) { }

  getUser() {
    return this.user;
  }
  setUser(user) {
    this.user = user;
  }
  authenticateResource() {
    return this._socketService.authenticateService();
  }
}
