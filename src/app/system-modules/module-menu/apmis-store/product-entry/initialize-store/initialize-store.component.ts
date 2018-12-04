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
	// item_to_show = true;
	clickItemIndex: number;
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
				this.selectedProduct = undefined;
				this.selectedProductName = '';
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
							if (this.productConfigs.length === 0) {
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
		console.log((<FormArray>this.productForm.get('productArray')).value);
	}

	configureProduct() {
		this.showConfigureProduct = true;
	}

	showNewBatch() {
		this.newBatchEntry = true;
	}

	// clickItemIndex(picked) {
	// 	console.log(picked);
	// 	return (this.item_to_show = !this.item_to_show);
	// }

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
		const product: ProductInitialize = {
			configProduct: this.selectedProduct,
			batches: [],
			costPrice: 0,
			margin: 0,
			sellingPrice: 0,
			totalCostPrice: 0,
			totalQuantity: 0,
			basePackType: ''
		};
		// this.selectedProducts.push(product);

		if (this.validateAgainstDuplicateProductEntry(product)) {
			this.pushProduct(product);
		}
	}

	validateAgainstDuplicateProductEntry(product) {
		const result = (<FormArray>this.productForm.get('productArray')).value.find(
			(x) => x.configProduct.id.toString() === product.configProduct.productObject.id.toString()
		);
		return result === undefined ? true : false;
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
		const newGrp = new FormGroup({
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
		this.subscribToFormControls();
		return newGrp;
	}

	pushBatch(picked: FormArray) {
		picked.controls['batches'].push(this.initBatch());
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
		try {
			if (this.productForm !== undefined) {
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
					(<FormArray>(<FormGroup>frmArray).controls['batches']).valueChanges.subscribe((value) => {
						(<FormGroup>frmArray).controls['totalQuantity'].setValue(this.getProductBatchQuantity(value));
						this.reCalculatePrices(frmArray, frmArray.value, 'totalQuantity');
					});

					const batchFormArray = (<FormArray>(<FormGroup>frmArray).controls['batches']).controls;
					batchFormArray.forEach((batchArray, j) => {
						(<FormGroup>batchArray).controls['quantity'].valueChanges
							.pipe(tap((val) => {}), debounceTime(200), distinctUntilChanged())
							.subscribe((value) => {
								// console.log(value);
								// console.log((<FormGroup>frmArray).controls['totalQuantity'].value);
								// const existingQuantity = (<FormGroup>frmArray).controls['totalQuantity'].value;
								// const finalQuantity = value + existingQuantity;
								// console.log(finalQuantity);
								// (<FormGroup>frmArray).controls['totalQuantity'].setValue(finalQuantity);
								// this.reCalculatePrices(frmArray, frmArray.value, 'totalQuantity');
								// this.getProductBatchQuantity(batchFormArray);
							});
					});
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	getProductBatchQuantity(batchFormArray) {
		let productQuantity = 0;
		batchFormArray.forEach((batchArray, j) => {
			const currentQuantity = batchArray.quantity;
			productQuantity = productQuantity + currentQuantity;
		});
		return productQuantity;
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
		} else if (control === 'totalQuantity') {
			value.totalCostPrice = value.costPrice * value.totalQuantity;
			array.controls['totalCostPrice'].setValue(value.totalCostPrice);
		}
	}

	item_to_show(i) {
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

	onSubmit() {}
}
