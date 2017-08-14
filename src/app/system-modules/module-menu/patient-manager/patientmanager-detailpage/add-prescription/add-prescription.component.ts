import { Component, OnInit, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Facility, Prescription, PrescriptionItem, User } from '../../../../../models/index';
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
	user: User = <User>{};
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
		private _productService: ProductService,
		private _facilityService: FacilitiesService
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
		this.user = <User>this._locker.getObject('auth');
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

	onClickDeleteItem(index: number, value: any) {
		const item = this.prescriptionItems.prescriptionItems[index];
		if(item.isBilled) {
			this.totalCost -= item.totalCost;
			this.totalQuantity -= item.quantity;
			this.prescriptionItems.prescriptionItems.splice(index, 1);
		} else {
			this.prescriptionItems.prescriptionItems.splice(index, 1);
		}
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
		if(!item.isBilled) {
			this.billShow = !this.billShow;
			this.billShowId = index;
			this.prescriptionItems.index = index;
			this.prescriptionItems.totalCost = this.totalCost;
			this.prescriptionItems.totalQuantity = this.totalQuantity;
			if(this.prescriptionItems.prescriptionItems[index].isExternal) {
				this.prescriptionItems.prescriptionItems[index].isExternal = false;
			}
			this.prescriptionData = this.prescriptionItems;
		} else {
			this._notification('Info', 'The item selected has been billed!');
		}
	}

	close_onClick(e) {
		this.billShow = false;
		this.totalCost = this.prescriptionData.totalCost;
		this.totalQuantity = this.prescriptionData.totalQuantity;
	}

	// Notification
	private _notification(type: string, text: string): void {
		this._facilityService.announceNotification({
			users: [this.user._id],
			type: type,
			text: text
		});
	}
}
