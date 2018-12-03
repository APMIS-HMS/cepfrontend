import { ProductInitialize } from './../../components/models/productInitialize';
import { ProductService } from './../../../../../services/facility-manager/setup/product.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

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
	selectedProduct: any;
	selectedProducts: any[];
	productForm: FormGroup;
	dateP;
	dateFormat = 'dd/MM/yyyy';

	constructor(private _productService: ProductService, private formBuilder: FormBuilder) {}

	ngOnInit() {
		this.dateP = new DatePipe(navigator.language);
		this.selectedProducts = [];
		this.productConfigSearch.valueChanges.distinctUntilChanged().debounceTime(200).subscribe((value) => {
			this.searchHasBeenDone = false;
			if (value !== null && value.length > 3 && this.selectedProductName.length === 0) {
				this._productService
					.findProductConfigs({
						query: {
							'productObject.name': { $regex: value, $options: 'i' }
						}
					})
					.then(
						(payload) => {
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

		this.InitializeProductArray();
		this.removeProduct(0);
	}

	close_onClick(e) {
		this.showConfigureProduct = false;
		this.newBatchEntry = false;
	}

	checkBatchValidation(batch: FormGroup) {
		batch.controls['complete'].setValue(true);
	}

	configureProduct() {
		this.showConfigureProduct = true;
	}

	showNewBatch() {
		this.newBatchEntry = true;
	}

	clickItemIndex(picked) {
		console.log(picked);
		return (this.item_to_show = !this.item_to_show);
	}

	setSelectedOption(data: any) {
		try {
			this.selectedProductName = data.productObject.name;
			this.selectedProduct = data;
			this.showProduct = false;
			this.productConfigSearch.setValue(this.selectedProductName);
		} catch (error) {}
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

	addProduct() {
		let product: ProductInitialize = {
			configProduct: this.selectedProduct,
			batches: [],
			costPrice: 0,
			margin: 0,
			sellingPrice: 0,
			totalCostPrice: 0,
			totalQuantity: 0,
			basePackType: ''
		};
		this.selectedProducts.push(product);
		this.pushProduct(product);
	}

	InitializeProductArray() {
		try {
			this.productForm = this.formBuilder.group({
				productArray: this.formBuilder.array([
					this.formBuilder.group({
						configProduct: [ '', [ <any>Validators.required ] ],
						batches: new FormArray([ this.initBatch() ]),
						totalQuantity: [ 0, [ <any>Validators.required ] ],
						basePackType: [ '', [ <any>Validators.required ] ],
						costPrice: [ 0, [ <any>Validators.required ] ],
						totalCostPrice: [ 0, [ <any>Validators.required ] ],
						margin: [ 0, [ <any>Validators.required ] ],
						sellingPrice: [ 0, [ <any>Validators.required ] ]
					})
				])
			});
			this.subscribToFormControls();
		} catch (error) {}
	}

	initProduct(product?: ProductInitialize) {
		return new FormGroup({
			totalQuantity: new FormControl(product === undefined ? '' : product.totalQuantity),
			batches: new FormArray([ this.initBatch() ]),
			basePackType: new FormControl(
				product === undefined || product.basePackType === undefined ? '' : product.basePackType
			),
			costPrice: new FormControl(
				product === undefined || product.costPrice === undefined ? '' : product.costPrice
			),
			totalCostPrice: new FormControl(
				product === undefined || product.totalCostPrice === undefined ? '' : product.totalCostPrice
			),
			margin: new FormControl(product === undefined || product.margin === undefined ? '' : product.margin),
			sellingPrice: new FormControl(product === undefined || product.margin === undefined ? '' : product.margin),
			configProduct: new FormControl(
				product === undefined || product.configProduct.productObject === undefined
					? ''
					: product.configProduct.productObject
			)
		});
	}

	initBatch(batch?) {
		return new FormGroup({
			batchNumber: new FormControl(
				batch === undefined || batch.batchNumber === undefined ? '' : batch.batchNumber
			),
			quantity: new FormControl(batch === undefined || batch.quantity === undefined ? 0 : batch.quantity),
			expiryDate: new FormControl(
				batch === undefined || batch.expiryDate === undefined
					? new Date().toISOString().substring(0, 10)
					: batch.expiryDate
			),
			complete: new FormControl(false, [])
		});
	}

	removeProduct(i) {
		const control = <FormArray>this.productForm.get('productArray');
		control.removeAt(i);
	}

	removeBatch(batches, i) {
		const control = <FormArray>batches;
		control.removeAt(i);
	}

	pushProduct(product?) {
		const control = <FormArray>this.productForm.get('productArray');
		control.push(this.initProduct(product));
		this.subscribToFormControls();
	}

	subscribToFormControls() {
		const formArray = (<FormArray>this.productForm.get('productArray')).controls;
		formArray.forEach((frmArray, i) => {
			(<FormGroup>frmArray).controls['costPrice'].valueChanges
				.pipe(tap((val) => {}), debounceTime(400), distinctUntilChanged())
				.subscribe((value) => {
					this.reCalculatePrices(frmArray, frmArray.value, 'costPrice');
				});

			(<FormGroup>frmArray).controls['totalCostPrice'].valueChanges
				.pipe(tap((val) => {}), debounceTime(400), distinctUntilChanged())
				.subscribe((value) => {
					this.reCalculatePrices(frmArray, frmArray.value, 'totalCostPrice');
				});

			(<FormGroup>frmArray).controls['margin'].valueChanges
				.pipe(tap((val) => {}), debounceTime(400), distinctUntilChanged())
				.subscribe((value) => {
					this.reCalculatePrices(frmArray, frmArray.value, 'margin');
				});

			const batchFormArray = (<FormArray>(<FormGroup>frmArray).controls['batches']).controls;
			batchFormArray.forEach((batchArray, j) => {
				(<FormGroup>batchArray).controls['quantity'].valueChanges
					.pipe(tap((val) => {}), debounceTime(200), distinctUntilChanged())
					.subscribe((value) => {
						// this.reCalculatePrices(frmArray, frmArray.value, 'margin');
					});
			});
		});
	}

	reCalculatePrices(array, value: ProductInitialize, control) {
		if (control === 'costPrice') {
			value.totalCostPrice = value.costPrice * value.totalQuantity;
			array.controls['totalCostPrice'].setValue(value.totalCostPrice);
		} else if (control === 'totalCostPrice') {
			value.costPrice = value.totalCostPrice / value.totalQuantity;
			array.controls['costPrice'].setValue(value.costPrice);
		} else if (control === 'margin') {
			value.sellingPrice = value.costPrice * (value.margin / 100) + value.costPrice;
			array.controls['sellingPrice'].setValue(value.sellingPrice);
		}
	}

	onSubmit() {}
}
