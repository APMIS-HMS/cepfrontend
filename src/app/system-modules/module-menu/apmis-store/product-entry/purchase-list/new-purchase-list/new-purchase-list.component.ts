import { InventoryService } from './../../../../../../services/facility-manager/setup/inventory.service';
import { Component, OnInit } from '@angular/core';
import { StoreGlobalUtilService } from '../../../store-utils/global-service';
import { Filters } from '../../../store-utils/global';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from 'app/models';

@Component({
	selector: 'app-new-purchase-list',
	templateUrl: './new-purchase-list.component.html',
	styleUrls: [ './new-purchase-list.component.scss' ]
})
export class NewPurchaseListComponent implements OnInit {
	storeFilters = [];
	selectedFilterIndex = 0;
	filterType = '';
	selectedFacility: any;
	storeId: string;
	products: any;
	numberOfPages: number;
	limit: any;
	total: any;
	skip: any;

	constructor(
		private storeUtilService: StoreGlobalUtilService,
		private _inventoryService: InventoryService,
		private _locker: CoolLocalStorage
	) {}

	ngOnInit() {
		this.storeFilters = this.storeUtilService.getObjectKeys(Filters);
		this.storeId = '5a88a0d26e6d17335cf318bc';
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.getInventoryList();
	}

	getInventoryList() {
		this._inventoryService
			.findFacilityProductList({
				query: {
					facilityId: this.selectedFacility._id,
					storeId: this.storeId,
					limit: this.limit,
					skip: this.skip * this.limit
				}
			})
			.then(
				(payload) => {
					this.products = payload.data;
					this.numberOfPages = payload.total / this.limit;
					this.total = payload.total;
				},
				(error) => {
					console.log(error);
				}
			);
	}
	setSelectedFilter(index, filter) {
		this.selectedFilterIndex = index;
		this.filterType = filter;
		// console.log(this.filterText);
	}
}
