import {
  WalletTransaction, TransactionType, EntityType, TransactionDirection, TransactionMedium
} from './../../../models/facility-manager/setup/wallet-transaction';
import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';
import { Person } from '../../../models/index';
const request = require('superagent');

@Injectable()
export class PersonService {
  public _socket;
  public createListener;
  public updateListener;
  private _rest;

  private personAnnouncedSource = new Subject<Person>();
  personAnnounced$ = this.personAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('people');
    this._socket = _socketService.getService('people');
    this._socket.timeout = 30000;
    this.createListener = Observable.fromEvent(this._socket, 'created');
    this.updateListener = Observable.fromEvent(this._socket, 'updated');
  }

  announcePerson(person: Person) {
    this.personAnnouncedSource.next(person);
  }
  receivePerson(): Observable<Person> {
    return this.personAnnouncedSource.asObservable();
  }

  find(query: any) {
    return this._socket.find(query);
  }

  findAll() {
    return this._socket.find();
  }
  get(id: string, query: any) {
    return this._rest.get(id, query);
  }

  create(person: any) {
    return this._socket.create(person);
  }
  update(person: any) {
    return this._socket.update(person._id, person);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  abridgePerson(person) {
    return {
      _id: person._id,
      apmisId: person.apmisId,
      email: person.email,
      firstName: person.firstName,
      lastName: person.lastName
    }
  }

  walletTransaction(walletTransaction: WalletTransaction) {
    const host = this._restService.getHost();
    const path = host + '/wallet-transaction';
    return request.get(path).query({
      destinationId: walletTransaction.destinationId,
      sourceId: walletTransaction.sourceId,
      transactionType: TransactionType[walletTransaction.transactionType],
      transactionMedium: TransactionMedium[walletTransaction.transactionMedium],
      amount: walletTransaction.amount,
      description: walletTransaction.description,
      sourceType: EntityType[walletTransaction.sourceType],
      destinationType: EntityType[walletTransaction.destinationType],
      transactionDirection:
        TransactionDirection[walletTransaction.transactionDirection]
    }); // query string
  }

  fundWallet(walletTransaction: WalletTransaction) {
    const host = this._restService.getHost();
    const path = host + '/fund-wallet';
    return new Promise((resolve, reject) => {
      resolve(
        request.get(path).query({
          ref: walletTransaction.ref,
          ePaymentMethod: walletTransaction.ePaymentMethod,
          paymentMethod: walletTransaction.paymentMethod,
          destinationId: walletTransaction.destinationId,
          sourceId: walletTransaction.sourceId,
          transactionType: TransactionType[walletTransaction.transactionType],
          transactionMedium: TransactionMedium[walletTransaction.transactionMedium],
          amount: walletTransaction.amount,
          description: walletTransaction.description,
          sourceType: EntityType[walletTransaction.sourceType],
          destinationType: EntityType[walletTransaction.destinationType],
          transactionDirection: TransactionDirection[walletTransaction.transactionDirection],
          paidBy: walletTransaction.paidBy
        })
      );
    });
    // return request
    //   .get(path)
    //   .query({
    //     paymentMethod: 'Cash',
    //     destinationId: walletTransaction.destinationId, sourceId: walletTransaction.sourceId,
    //     transactionType: TransactionType[walletTransaction.transactionType],
    //     transactionMedium: TransactionMedium[walletTransaction.transactionMedium],
    //     amount: walletTransaction.amount, description: walletTransaction.description,
    //     source: EntityType[walletTransaction.source],
    //     destination: EntityType[walletTransaction.destination],
    //     transactionDirection: TransactionDirection[walletTransaction.transactionDirection]
    //   }); // query string
  }
}
