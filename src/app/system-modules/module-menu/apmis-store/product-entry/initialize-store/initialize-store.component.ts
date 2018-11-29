import { ProductService } from './../../../../../services/facility-manager/setup/product.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-initialize-store',
	templateUrl: './initialize-store.component.html',
	styleUrls: [ './initialize-store.component.scss' ]
})
export class InitializeStoreComponent implements OnInit {
	item_to_show = true;
	expand_row = false;
	showConfigureProduct = false;
	newBatchEntry = false;

	productConfigSearch: FormControl = new FormControl();
	productConfigs: any[] = [];
	selectedProductName: any;
	showProduct: boolean;

	constructor(private _productService: ProductService) {}

	ngOnInit() {
		//  .distinctUntilChanged()
		// 	.debounceTime(200)
		// 	.switchMap((term) => Observable.fromPromise(this.patientService.find({
		// 		query:
		// 		{
		// 			search: term,
		// 			facilityId: this.selectedFacility._id
		// 		}
		// 	}))).subscribe((payload: any) => {
		// 		this.people = payload.data;
		// 	});

		// name:{
		//  $regex: this.searchControl.value, '$options': 'i' }

		this.productConfigSearch.valueChanges.distinctUntilChanged().debounceTime(200).subscribe((value) => {
			if (value.length > 0) {
				this._productService
					.findProductConfigs({
						query: {
							'productObject.name': { $regex: value, $options: 'i' }
						}
					})
					.then(
						(payload) => {
							console.log(payload);
							this.productConfigs = payload.data;
							this.showProduct = true;
						},
						(error) => {
							console.log(error);
							this.showProduct = false;
						}
					);
			}
		});
	}

	close_onClick(e) {
		this.showConfigureProduct = false;
		this.newBatchEntry = false;
	}

	configureProduct() {
		this.showConfigureProduct = true;
	}

	showNewBatch() {
		this.newBatchEntry = true;
	}

	clickItemIndex() {
		return (this.item_to_show = !this.item_to_show);
	}

	setSelectedOption(data: any) {
		this.selectedProductName = data.productObject.anem;
		this.showProduct = false;
	}
}
