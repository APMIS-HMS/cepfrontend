import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OrderSetSharedService {
  public itemSubject = new Subject<any>();
  // private _itemAnnounceSource = new Subject<any>();
  // announcedItem = this._itemAnnounceSource.asObservable();
  // items: any[] = [];

  constructor() {
    console.log('INstantiated');
  }

  // setItem(value: any) {
  //   console.log(value);
  //   this._itemAnnounceSource.next(value);
  // }

  saveItem(value: any) {
    this.itemSubject.next(value);
  }
}
