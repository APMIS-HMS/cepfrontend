import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Facility, Prescription, PrescriptionItem } from '../../../../../models/index';
import {
    FacilitiesService, ProductService, FacilityPriceService, InventoryService, AssessmentDispenseService
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
	cost: number = 0; // Unit price for each drug.
	totalCost: number = 0; // Total price for each drug selected.
	totalQuantity: number = 0;
	batchNumber: string = '';
	qtyInStores: number = 0;
	storeId: string = '';

	mainErr: boolean = true;
	errMsg = 'You have unresolved errors';

	constructor(
		private _fb: FormBuilder,
		private _locker: CoolSessionStorage,
		private _productService: ProductService,
		private _facilityService: FacilitiesService,
		private _facilityPriceService: FacilityPriceService,
		private _inventoryService: InventoryService,
		private _assessmentDispenseService: AssessmentDispenseService
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

		this.addBillForm.controls['qty'].valueChanges.subscribe(val => {
			if(val > 0) {
				this.totalQuantity = val;
				this.totalCost = this.cost * val;
			} else {
				this._facilityService.announceNotification({
					type: 'Error',
					text: 'Quantity should be greater than 0!'
				});
			}
		})
	}

	//
	onClickSaveCost(value, valid) {
		if(valid) {
			if(this.cost > 0 || value.qty > 0) {
				console.log(value);
				let index = this.prescriptionData.index;
				this.prescriptionData.prescriptionItems[index].productId = value.drug; 
				this.prescriptionData.prescriptionItems[index].productName = this.selectedDrug; 
				this.prescriptionData.prescriptionItems[index].quantity = value.qty;
				this.prescriptionData.prescriptionItems[index].cost = this.cost;
				this.prescriptionData.prescriptionItems[index].totalCost = this.totalCost;
				this.prescriptionData.prescriptionItems[index].isBilled = true;
				this.prescriptionData.totalCost += this.totalCost;
				this.prescriptionData.totalQuantity += this.totalQuantity;
				console.log(this.prescriptionData);

				this.closeModal.emit(true);
			} else {
				this._facilityService.announceNotification({
					type: 'Error',
					text: 'Unit price or Quantity is less than 0!'
				});
			}
		} else {
			this.mainErr = false;
		}
	}

	getProductsForGeneric() {
		const index = this.prescriptionData.index;
		this.title = this.prescriptionData.prescriptionItems[index].genericName;
		const genericName = this.prescriptionData.prescriptionItems[index].genericName.split(' ');
			// Get the list of products from a facility, and then search if the generic
			// that was entered by the doctor in contained in the list of products
			// this._productService.find({ query: { facilityId : this.facility._id }})
			this._assessmentDispenseService.find({ query: { facilityId : this.facility._id, generic: genericName[0] }})
				.then(res => {
					console.log(res);
					this.drugs = res;
				})
				.catch(err => {
					console.log(err);
				});
	}

	onClickCustomSearchItem(event, drugId) {
		this.selectedDrug = drugId.viewValue;
		const pId = drugId._element.nativeElement.getAttribute('data-p-id');
		const pPrice = drugId._element.nativeElement.getAttribute('data-p-price');
		const pAqty = drugId._element.nativeElement.getAttribute('data-p-aqty');
		this.cost = pPrice;
		this.qtyInStores = pAqty;

		//const pId = '592417935fbce732205cf0aa';
		// const sId = drugId._element.nativeElement.getAttribute('data-p-id');
		// const fsId = drugId._element.nativeElement.getAttribute('data-p-fsid');
		// const cId = drugId._element.nativeElement.getAttribute('data-p-cid');
		// Get the service for the product
		// if(this.storeId !== '') {
			// this._assessmentDispenseService.find({ query: { facilityId : this.facility._id, productId: pId }})
			// 	.then(res => {
			// 		if (res.length > 0) {
			// 			console.log(res);
			// 			this.cost = res[0].price;
			// 			this.batchNumber = res[0].batchNo;
			// 			this.qtyInStores = res[0].availableQty;
			// 		}
			// 	})
			// 	.catch(err => {
			// 		console.log(err);
			// 	});
		// } else {
		// 	this._facilityService.announceNotification({
		// 		type: "Error",
		// 		text: "You need to check into store."
		// 	});
		// }


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

	onClickClose(e) {
		 this.closeModal.emit(true);
	}

}
