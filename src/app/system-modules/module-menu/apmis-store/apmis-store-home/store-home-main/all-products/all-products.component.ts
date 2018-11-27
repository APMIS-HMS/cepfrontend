import { InventoryService } from './../../../../../../services/facility-manager/setup/inventory.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { StoreGlobalUtilService } from '../../../store-utils/global-service';
import { ProductsToggle } from '../../../store-utils/global';

@Component({
	selector: 'app-all-products',
	templateUrl: './all-products.component.html',
	styleUrls: [ './all-products.component.scss' ]
})
export class AllProductsComponent implements OnInit {
	showAdjustStock = false;
	showProductDistribution = false;
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
		this.getInventoryList();
		// this.productToggles = this.storeUtilService.getObjectKeys(ProductsToggle);
	}

	getInventoryList() {
		this._inventoryService
			.findFacilityProductList({
				query: { facilityId: this.selectedFacility._id, storeId: this.storeId }
			})
			.then(
				(payload) => {
					this.products = payload.data;
					this.numberOfPages = this.products.length / this.limit;
					this.total = this.products.length;
				},
				(error) => {
					console.log(error);
				}
			);
	}

	item_to_show(i) {
		if (this.expand_row) {
			return this.clickItemIndex === i;
		}
	}
	toggle_tr(itemIndex) {
		this.clickItemIndex = itemIndex;
		this.expand_row = !this.expand_row;
	}

	loadCurrentPage(event) {
		this.skip = event;
	}

	getProductSlice(products) {
		const first = this.skip * this.limit;
		const second = this.limit + this.skip * this.limit;
		const slicedProducts = products.slice(first, second);
		return slicedProducts;
	}

	close_onClick(e) {
		this.showAdjustStock = false;
		this.showProductDistribution = false;
	}

	productDistribution() {
		this.showProductDistribution = true;
	}

	adjustStock() {
		this.showAdjustStock = true;
	}
	setSelectedToggle(index, toggle) {
		// this.selectedToggleIndex = index;
	}
}
