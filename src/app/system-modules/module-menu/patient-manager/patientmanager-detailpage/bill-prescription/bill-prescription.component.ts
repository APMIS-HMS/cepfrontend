import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Facility, Prescription, PrescriptionItem } from '../../../../../models/index';
import {
    FacilitiesService, ProductService, FacilityPriceService, InventoryService
} from '../../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-bill-prescription',
	templateUrl: './bill-prescription.component.html',
	styleUrls: ['./bill-prescription.component.scss']
})
export class BillPrescriptionComponent implements OnInit {
	@Input() prescriptionData: Prescription = <Prescription>{};
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	//@Input() employeeDetails: any;
	facility: Facility = <Facility>{};

	addBillForm: FormGroup;
	drugs: any[] = [];
	selectedDrug: string = '';
	itemCost: number = 0;
	title: string = '';
	price: number = 0;
	qtyInStores: number = 0;
	storeId: string = '';

	mainErr: boolean = true;
	errMsg: string = 'You have unresolved errors';

	constructor(
		private _fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _productService: ProductService,
		private _facilityService: FacilitiesService,
		private _facilityPriceService: FacilityPriceService,
		private _inventoryService: InventoryService 
	) { }

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		console.log(this.prescriptionData);

		// if(this.employeeDetails.storeCheckIn !== undefined) {
		// 	this.storeId = this.employeeDetails.storeCheckIn[0].storeId;
		// }
		
		// Remove this when you are done.
		this.storeId = '591d71d971108943a0499665';

		this.getProductsForGeneric();

		this.addBillForm = this._fb.group({
			drug: ['', [<any>Validators.required]],
			qty: [0, [<any>Validators.required]]
		});

		// this.addBillForm.controls['drug'].valueChanges.subscribe(val => {
		// 	console.log(val);
		// 	let fsId: string = '';
		// 	let sId: string = '';
		// 	let cId: string = '';
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
		// })
	}

	// 
	onClickSaveCost(value, valid) {
		if(valid) {
			//if(this.price > 0 || value.qty > 0) {
				let index = this.prescriptionData.index;
				this.prescriptionData.prescriptionItems[index].productId = value.drug; 
				this.prescriptionData.prescriptionItems[index].productName = this.selectedDrug; 
				this.prescriptionData.prescriptionItems[index].quantity = value.qty;
				this.prescriptionData.prescriptionItems[index].cost = this.price;
				this.prescriptionData.prescriptionItems[index].isBilled = true;
				console.log(this.prescriptionData);

				this.closeModal.emit(true);
			// } else {
			// 	this._facilityService.announceNotification({
			// 		type: "Error",
			// 		text: "Unit price or Quantity is less than 0!"
			// 	});
			// }
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
		this.selectedDrug = drugId.viewValue;
		let pId = drugId._element.nativeElement.getAttribute('data-p-id');
		let sId = drugId._element.nativeElement.getAttribute('data-p-id');
		let fsId = drugId._element.nativeElement.getAttribute('data-p-fsid');
		let cId = drugId._element.nativeElement.getAttribute('data-p-cid');
		// Get the service for the product
		if(this.storeId !== '') {
			this._inventoryService.find({ query: { facilityId : this.facility._id, storeId: this.storeId }})
				.then(res => {
					console.log(res);
					// if(res.data.length > 0) {
					// 	if(res.data[0].price !== undefined) {
					// 		this.price = res.data[0].price;
					// 	}
					// }
				})
				.catch(err => {
					console.log(err);
				});
		} else {
			this._facilityService.announceNotification({
				type: "Error",
				text: "You need to check into store."
			});
		}


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

	onClickClose(e) {
		 this.closeModal.emit(true);
	}

}
