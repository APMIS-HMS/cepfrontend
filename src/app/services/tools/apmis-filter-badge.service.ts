import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ApmisFilterBadgeService {
	item$: Observable<any>;
	private itemSubject = new Subject<any>();

	storage$: Observable<any>;
	private storageSubject = new Subject<any>();

	constructor() {
		this.item$ = this.itemSubject.asObservable();
		this.storage$ = this.storageSubject.asObservable();
	}

	reset(status:boolean) {
		this.itemSubject.next(status);
	}	

	clearItemsStorage(status:boolean) {
		this.storageSubject.next(status);
	}	
}
