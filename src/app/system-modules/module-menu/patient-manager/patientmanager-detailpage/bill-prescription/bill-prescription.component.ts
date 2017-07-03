import { Component, OnInit, Output, Input } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Facility, Prescription, PrescriptionItem } from '../../../../../models/index';
import {
    FacilitiesService, ProductService, FacilityPriceService
} from '../../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-bill-prescription',
	templateUrl: './bill-prescription.component.html',
	styleUrls: ['./bill-prescription.component.scss']
})
export class BillPrescriptionComponent implements OnInit {
	@Input() prescriptionData: Prescription = <Prescription>{};
	facility: Facility = <Facility>{};

	addBillForm: FormGroup;
	drugs: any[] = [];
	itemCost: number = 0;
	title: string = '';
	price: number = 0;

	mainErr: boolean = true;
	errMsg: string = 'You have unresolved errors';

	constructor(
		private _fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _productService: ProductService,
		private _facilityPriceService: FacilityPriceService
	) { }

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		console.log(this.prescriptionData);

		this.getProductsForGeneric();

		this.addBillForm = this._fb.group({
			drug: ['', [<any>Validators.required]],
			qty: [1, [<any>Validators.required]]
		});

		this.addBillForm.controls['drug'].valueChanges.subscribe(val => {
			console.log(val);
			let fsId: string = '';
			let sId: string = '';
			let cId: string = '';
			// Get the service for the product
			// this._facilityPriceService.find({ query : { facilityId : this.facility._id, facilityServiceId: fsId, serviceId: sId, categoryId: cId}})
			// 	.then(res => {
			// 		console.log(res);
			// 		if(res.data.length > 0) {
			// 			if(res.data[0].price !== undefined) {
			// 				this.price = res.data[0].price;
			// 			}
			// 		}
			// 	})
			// 	.catch(err => {
			// 		console.log(err);
			// 	})
		})
	}

	// 
	onClickSaveCost(value, valid) {
		if(valid) {
			let index = this.prescriptionData.index;
			this.prescriptionData.prescriptionItems[index].drugId = value.drug; 
			this.prescriptionData.prescriptionItems[index].quantity = value.qty;
			this.prescriptionData.prescriptionItems[index].isBilled = true;
			console.log(this.prescriptionData);
		} else {
			this.mainErr = false;
		}
	}

	getProductsForGeneric() {
		let index = this.prescriptionData.index;
		this.title = this.prescriptionData.prescriptionItems[index].genericName;
		let genericName = this.prescriptionData.prescriptionItems[index].genericName.split(' ');
			//Get the list of products from a facility, and then search if the generic
			//that was entered by the doctor in contained in the list of products
			this._productService.find({ query: { facilityId : this.facility._id }})
				.then(res => {
					console.log(res);
					let tempArray = [];
					// Get all products in the facility, then search for the item you are looking for.
					res.data.forEach(element => {
						if(element.genericName.toLowerCase().includes(genericName[0].toLowerCase())) {
							tempArray.push(element);
						}
					});
					console.log(tempArray);
					if(tempArray.length !== 0) {
						this.drugs = tempArray;
					} else {
						this.drugs = [];
					}
				})
				.catch(err => {
					console.log(err);
				});
	}

	onClickCustomSearchItem(event, drugId) {
		//this.addBillForm.controls['product'].setValue(event.srcElement.innerText);
		//this.selectedProductId = drugId.getAttribute('data-p-id');
		let fsId = drugId.getAttribute('data-p-fsid');
		let sId = drugId.getAttribute('data-p-sid');
		let cId = drugId.getAttribute('data-p-cid');
		// Get the service for the product
		// this._facilityPriceService.find({ query : { facilityId : this.facility._id, facilityServiceId: fsId, serviceId: sId, categoryId: cId}})
		// 	.then(res => {
		// 		console.log(res);
		// 		if(res.data.length > 0) {
		// 			if(res.data[0].price !== undefined) {
		// 				this.price = res.data[0].price;
		// 			}
		// 		}
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	})
	}

	// Get the price for product selected
	// getProductService() {
	// 	// Get the service for the product
	// 	this._facilityPriceService.find({ query : { facilityId : this.facility._id, facilityServiceId: fsId, serviceId: sId, categoryId: cId}})
	// 		.then(res => {
	// 			console.log(res);
	// 			if(res.data.length > 0) {
	// 				if(res.data[0].price !== undefined) {
	// 					this.price = res.data[0].price;
	// 				}
	// 			}
	// 		})
	// 		.catch(err => {
	// 			console.log(err);
	// 		})
	// }

}
