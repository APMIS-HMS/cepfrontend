import { Component, OnInit, Input } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { StoreService } from './../../../../../services/facility-manager/setup/store.service';
import { FacilitiesService } from './../../../../../services/facility-manager/setup/facility.service';
import { Facility } from 'app/models';

@Component({
	selector: 'app-store-tab',
	templateUrl: './store-tab.component.html',
	styleUrls: ['./store-tab.component.scss']
})
export class StoreTabComponent implements OnInit {
	@Input() locationId: any = <any>{};
	@Input() minorLocationId: any = <any>{};
	selectedFacility: any;
	stores: any = [];
	total = 0;
	skip = 0;
	numberOfPages = 0;
	currentPage = 0;
	limit = 2;
	constructor(private _storeService: StoreService, private _locker: CoolLocalStorage, private facilitiesService: FacilitiesService) {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this._storeService.store$.subscribe(minorLocationId => {
			this.getStores(this.selectedFacility._id,minorLocationId);
		});
	}

	ngOnInit() {
		this.getStores(this.selectedFacility._id);
	}
	

	getStores(facilityId, minorLocationId?) {
		this._storeService.getStoreList({ query: { facilityId: facilityId, minorLocationId: minorLocationId } }).then(
			(payload) => {
				this.stores = payload.data.data;
				this.numberOfPages = this.stores.length / this.limit;
				this.total = this.stores.length;
			},
			(error) => {
			}
		);
	}
	loadCurrentPage(event) {
		this.skip = event;
	}
}
