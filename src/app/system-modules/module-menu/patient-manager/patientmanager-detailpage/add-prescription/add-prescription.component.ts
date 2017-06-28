import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Facility, PrescriptionItem } from '../../../../../models/index';

@Component({
  selector: 'app-add-prescription',
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.scss']
})
export class AddPrescriptionComponent implements OnInit {
	@Input() prescriptionItems: PrescriptionItem[] = [];

	addBillForm: FormGroup;
	billShow: boolean = false;
	billShowId: number = 0;
	drugs: string[] = [];

	constructor(
		private _fb: FormBuilder
	) {

	}

	ngOnInit() {
		 console.log(this.prescriptionItems);
		 this.addBillForm = this._fb.group({

		 });
	}

	onClickDeleteItem(value: any) {
		this.prescriptionItems.splice(value, 1);
	}

	toggleBill(index) {
		this.billShow = !this.billShow;
		this.billShowId = index;
	}
}
