import { Component, OnInit, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Facility, Prescription, PrescriptionItem } from '../../../../../models/index';
import {
    FacilitiesService, ProductService
} from '../../../../../services/facility-manager/setup/index';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-add-prescription',
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.scss']
})
export class AddPrescriptionComponent implements OnInit {
	@Input() prescriptionItems: Prescription = <Prescription>{};
	@Output() prescriptionData: Prescription = <Prescription>{};
	@Input() isDispensed: Subject<any>;
	facility: Facility = <Facility>{};

	billShow: boolean = false;
	billShowId: number = 0;
	isExternal: boolean = false;
	loading: boolean = false;
	totalCost: number = 0;
	totalQuantity: number = 0;
	isDispensePage: boolean = false;
	isPrescriptionPage: boolean = false;

	constructor(
		private _route: ActivatedRoute,
		private _locker: CoolSessionStorage,
		private _productService: ProductService
	) {
		let url = window.location.href;
		if(!url.includes('patient-manager-detail')) {
			this.loading = true;
			this.isDispensePage = true;
		} else {
			this.isPrescriptionPage = true;
		}
	}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.prescriptionItems.prescriptionItems = [];
		
		if(this.isDispensed !== undefined) {
			this.isDispensed.subscribe(event => {
				if(event) {
					this.totalCost = 0;
					this.totalQuantity = 0;
					this.prescriptionData = <Prescription>{};
					this.prescriptionItems.prescriptionItems = [];
				}
			});
		}
	}

	onClickDeleteItem(value: any) {
		this.prescriptionItems.prescriptionItems.splice(value, 1);
	}

	// On click is external checkbox
	onClickIsExternal(index, value, prescription) {
		this.isExternal = value;
		this.billShowId = index;
		this.prescriptionItems.prescriptionItems[index].initiateBill = !prescription.initiateBill;
		this.prescriptionItems.prescriptionItems[index].isExternal = value;
	}

	// Bill toggel button
	toggleBill(index, item) {
		//if(!item.isBilled) {
			this.billShow = !this.billShow;
			this.billShowId = index;
			this.prescriptionItems.index = index;
			this.prescriptionItems.totalCost = this.totalCost;
			this.prescriptionItems.totalQuantity = this.totalQuantity;
			if(this.prescriptionItems.prescriptionItems[index].isExternal) {
				this.prescriptionItems.prescriptionItems[index].isExternal = false;
			}
			this.prescriptionData = this.prescriptionItems;
		//}
	}

	close_onClick(e) {
		this.billShow = false;
		this.totalCost = this.prescriptionData.totalCost;
		this.totalQuantity = this.prescriptionData.totalQuantity;
	}
}
