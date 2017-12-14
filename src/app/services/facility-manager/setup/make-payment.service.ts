import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MakePaymentService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('make-payment');
    this._socket = _socketService.getService('make-payment');
    
  }

  create(obj: any) {
    return this._rest.create(obj);
  }

}
