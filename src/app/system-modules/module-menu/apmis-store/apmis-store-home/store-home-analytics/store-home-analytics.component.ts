import { Component, OnInit } from '@angular/core';
import { StoreService } from 'app/services/facility-manager/setup';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from 'app/models';

@Component({
	selector: 'app-store-home-analytics',
	templateUrl: './store-home-analytics.component.html',
	styleUrls: [ './store-home-analytics.component.scss' ]
})
export class StoreHomeAnalyticsComponent implements OnInit {
	selectedFacility: Facility;
	constructor(private _locker: CoolLocalStorage) {}

	ngOnInit() {}

	getStoreStatistics() {
		// this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		// console.log(this.selectedFacility);
		// this._storeService.getStatistics({ facilityId: this.selectedFacility }, {}).then(
		// 	(payload) => {
		// 		console.log(payload);
		// 	},
		// 	(error) => {
		// 		console.log(error);
		// 	}
		// );
	}
}
