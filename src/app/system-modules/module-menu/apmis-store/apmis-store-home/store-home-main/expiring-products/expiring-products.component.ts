import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'app/services/facility-manager/setup';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from 'app/models';

@Component({
	selector: 'app-expiring-products',
	templateUrl: './expiring-products.component.html',
	styleUrls: [ './expiring-products.component.scss' ]
})
export class ExpiringProductsComponent implements OnInit {
	clickItemIndex: number;
	expand_row = false;
	total = 0;
	skip = 0;
	numberOfPages = 0;
	currentPage = 0;
	limit = 2;
	packTypes = [ { id: 1, name: 'Sachet' }, { id: 2, name: 'Cartoon' } ];
	storeId: string;
	selectedFacility: any;
	products: any = [];

	constructor(private _inventoryService: InventoryService, private _locker: CoolLocalStorage) {}

	ngOnInit() {
		this.storeId = '5a88a0d26e6d17335cf318bc';
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.getAboutToExpireInventoryList();
	}

	getAboutToExpireInventoryList() {
		this._inventoryService
			.getAboutToExpireInventoryDetails({
				query: { facilityId: this.selectedFacility._id, storeId: this.storeId, numberOfDays: 3000 }
			})
			.then(
				(payload) => {
					console.log(payload);
					this.products = payload.data.data;
					this.numberOfPages = this.products.length / this.limit;
					this.total = this.products.length;
				},
				(error) => {
					console.log(error);
				}
			);
	}

	loadCurrentPage(event) {
		this.skip = event;
	}

	item_to_show(i) {
		// if (this.expand_row) {
		// 	return this.clickItemIndex === i;
		// }
		return this.clickItemIndex === i;
	}
	toggle_tr(itemIndex, direction) {
		if (direction === 'down' && itemIndex === this.clickItemIndex) {
			this.expand_row = false;
			this.clickItemIndex = -1;
		} else {
			this.clickItemIndex = itemIndex;
			this.expand_row = !this.expand_row;
		}
	}
}
