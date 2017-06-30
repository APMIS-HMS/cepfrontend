import { Component, OnInit, Input } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Facility, PrescriptionItem } from '../../../../../models/index';
import {
    FacilitiesService, ProductService
} from '../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-add-prescription',
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.scss']
})
export class AddPrescriptionComponent implements OnInit {
	@Input() prescriptionItems: PrescriptionItem[] = [];
	facility: Facility = <Facility>{};

	addBillForm: FormGroup;
	billShow: boolean = false;
	billShowId: number = 0;
	drugs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	isExternal: boolean = false;

	constructor(
		private _fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _productService: ProductService
	) {

	}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		console.log(this.prescriptionItems);
		 this.addBillForm = this._fb.group({

		 });
	}

	onClickDeleteItem(value: any) {
		this.prescriptionItems.splice(value, 1);
	}

	// On click is external checkbox
	onClickIsExternal(index, value) {
		console.log(value);
		console.log(index);
		this.isExternal = value;
		this.billShowId = index;
	}

	toggleBill(index, item) {
		this.billShow = !this.billShow;
		this.billShowId = index;
		if(this.billShow) {
			console.log(item);
			let genericName = item.genericName.split(' ');
			console.log(genericName[0]);
			// Get the list of products from a facility, and then search if the generic
			// that was entered by the doctor in contained in the list of products
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
						//this.drugs[index] = tempArray;
					} else {
						//this.products = [];
					}
				})
				.catch(err => {
					console.log(err);
				});
		}
	}
}
