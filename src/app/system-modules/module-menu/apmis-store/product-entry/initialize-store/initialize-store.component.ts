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
	searchHasBeenDone = false;

	constructor(private _productService: ProductService) {}

	ngOnInit() {
		this.productConfigSearch.valueChanges.distinctUntilChanged().debounceTime(200).subscribe((value) => {
			this.searchHasBeenDone = false;
			if (value.length > 0 && this.selectedProductName.length === 0) {
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
							if (this.productConfigs.length < 0) {
								this.searchHasBeenDone = true;
							} else {
								this.searchHasBeenDone = false;
							}
						},
						(error) => {
							this.showProduct = false;
							this.searchHasBeenDone = false;
						}
					);
			} else {
				this.selectedProductName = '';
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
		try {
			this.selectedProductName = data.productObject.name;
			this.showProduct = false;
			this.productConfigSearch.setValue(this.selectedProductName);
		} catch (error) {
			console.log(error);
		}
	}

	onFocus(focus) {
		if (focus === 'in') {
			this.selectedProductName = '';
			this.showProduct = true;
		} else {
			setTimeout(() => {
				this.showProduct = false;
			}, 300);
		}
	}
}
