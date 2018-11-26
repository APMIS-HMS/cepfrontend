import { InventoryService } from './../../../../../../services/facility-manager/setup/inventory.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';

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
	products: any[] = [
		{
			productName: 'Medroxyprogesterone acetate 10 MG Oral Tablet [Curretab]',
			quantity: '100',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Tetracycline 0.01 MG/MG Ophthalmic Ointment [Achromycin]',
			quantity: '1005',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Nifedipine 10 MG Oral Capsule [Adalat]',
			quantity: '3500',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Oxymetholone 50 MG Oral Tablet [Anadrol-50]',
			quantity: '900',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Oxymetholone 50 MG Oral Tablet [Anadrol-50]',
			quantity: '900',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Oxymetholone 50 MG Oral Tablet [Anadrol-50]',
			quantity: '900',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Oxymetholone 50 MG Oral Tablet [Anadrol-50]',
			quantity: '900',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Oxymetholone 50 MG Oral Tablet [Anadrol-50]',
			quantity: '900',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Oxymetholone 50 MG Oral Tablet [Anadrol-50]',
			quantity: '900',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		}
	];
	storeId: string;
	selectedFacility: any;

	constructor(private _inventoryService: InventoryService, private _locker: CoolLocalStorage) {}

	ngOnInit() {
		this.numberOfPages = this.products.length / this.limit;
		this.total = this.products.length;
		this.storeId = '5a88a0d26e6d17335cf318bc';
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.getInventoryList();
	}

	getInventoryList() {
		this._inventoryService
			.findList({
				query: { facilityId: this.selectedFacility._id, name: '', storeId: this.storeId }
			})
			.then(
				(payload) => {
					console.log(payload);
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
}
