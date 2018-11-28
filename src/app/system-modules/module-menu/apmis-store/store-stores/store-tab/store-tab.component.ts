import { StoreService } from './../../../../../services/facility-manager/setup/store.service';
import { Component, OnInit } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from 'app/models';

@Component({
	selector: 'app-store-tab',
	templateUrl: './store-tab.component.html',
	styleUrls: [ './store-tab.component.scss' ]
})
export class StoreTabComponent implements OnInit {
	selectedFacility: any;
	stores: any = [];
	total = 0;
	skip = 0;
	numberOfPages = 0;
	currentPage = 0;
	limit = 2;
	constructor(private _store: StoreService, private _locker: CoolLocalStorage) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.getStores();
	}

	getStores() {
		this._store.getStoreList({ query: { facilityId: this.selectedFacility._id } }).then(
			(payload) => {
				console.log(payload);
				this.stores = payload.data.data;
				this.numberOfPages = this.stores.length / this.limit;
				this.total = this.stores.length;
				console.log(this.stores);
			},
			(error) => {
				console.log(error);
			}
		);
	}
	loadCurrentPage(event) {
		this.skip = event;
	}
}
