import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PendingBillService {
  private _rest;
  constructor(private _restService: RestService) {
    this._rest = _restService.getService('pending-bills');
  }

  get(obj: any) {
    return this._rest.create(obj);
  }

}

