import { Component, OnInit, Input, Output } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Facility, Prescription, PrescriptionItem } from '../../../../../models/index';
import {
    FacilitiesService, ProductService
} from '../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-add-prescription',
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.scss']
})
export class AddPrescriptionComponent implements OnInit {
	@Input() prescriptionItems: Prescription = <Prescription>{};
	@Output() prescriptionData: Prescription = <Prescription>{};
	facility: Facility = <Facility>{};

	billShow: boolean = false;
	billShowId: number = 0;
	isExternal: boolean = false;
	loading: boolean = false;

	constructor(
		private _locker: CoolLocalStorage,
		private _productService: ProductService
	) {
	
	}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		console.log(this.prescriptionItems);
		this.prescriptionItems.prescriptionItems = [];
	}

	onClickDeleteItem(value: any) {
		this.prescriptionItems.prescriptionItems.splice(value, 1);
	}

	// On click is external checkbox
	onClickIsExternal(index, value, prescription) {
		console.log(value);
		this.isExternal = value;
		this.billShowId = index;
		this.prescriptionItems.prescriptionItems[index].initiateBill = !prescription.initiateBill;
		this.prescriptionItems.prescriptionItems[index].isExternal = value;
		console.log(this.prescriptionItems);
	}

	toggleBill(index, item) {
		if(!item.isBilled) {
			this.billShow = true;
			this.billShowId = index;
			console.log(item);
			this.prescriptionItems.index = index;
			this.prescriptionData = this.prescriptionItems;
			// let genericName = item.genericName.split(' ');
			// // Get the list of products from a facility, and then search if the generic
			// // that was entered by the doctor in contained in the list of products
			// this._productService.find({ query: { facilityId : this.facility._id }})
			// 	.then(res => {
			// 		console.log(res);
			// 		let tempArray = [];
			// 		// Get all products in the facility, then search for the item you are looking for.
			// 		res.data.forEach(element => {
			// 			if(element.genericName.toLowerCase().includes(genericName[0].toLowerCase())) {
			// 				tempArray.push(element);
			// 			}
			// 		});
			// 		console.log(tempArray);
			// 		if(tempArray.length !== 0) {
			// 			this.prescriptionData = this.prescriptionItems;
			// 			this.drugs = tempArray;
			// 		} else {
			// 			this.drugs = [];
			// 		}
			// 	})
			// 	.catch(err => {
			// 		console.log(err);
			// 	});
		}
	}

	close_onClick(e) {
		this.billShow = false;
	}
}
