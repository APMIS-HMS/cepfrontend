import { Component, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, PrescriptionItem } from '../../../../models/index';
import { FacilitiesService, PrescriptionService } from '../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-dispense',
	templateUrl: './dispense.component.html',
	styleUrls: ['./dispense.component.scss']
})
export class DispenseComponent implements OnInit {
	@Output() prescriptionItems: PrescriptionItem[] = [];
	facility: Facility = <Facility>{};
	//prescriptionId: string = '';
	//hasPrescriptionId: boolean = false;
	//hasPrescription: boolean = true;
	//noPrescription: boolean = false;

	constructor(
		private _locker: CoolLocalStorage,
		//private _route: ActivatedRoute,
	) {

	}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		// this._route.params.subscribe(params => {
		// 	console.log(params)
		// 	this.prescriptionId = params['id'];
		// 	if(params['id']){
		// 		this.hasPrescriptionId = true;
		// 	}
		// });
	}
	
	// hasPrescriptionShow() {
	// 	this.hasPrescription = true;
	// 	this.noPrescription = false;
	// }
	// noPrescriptionShow() {
	// 	this.noPrescription = true;
	// 	this.hasPrescription = false;
	// }

}
