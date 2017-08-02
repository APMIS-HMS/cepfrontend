import { Component, OnInit, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Facility, User } from '../../../../models/index';
import {
    FacilitiesService, GenderService, CountriesService
} from '../../../../services/facility-manager/setup/index';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})

export class NewRequestComponent implements OnInit {
	// facility: Facility = <Facility>{};
	// user: User = <User>{};
	// newRequestForm: FormGroup;
	// genders: any[] = [];
	// nationalities: any[] = [];
	// states: any[] = [];
	// lgas: any[] = [];

	isParent: boolean = false;
	isPanel: boolean = true;

	constructor(
		// private _fb: FormBuilder,
		// private _locker: CoolSessionStorage,
		// private _genderService: GenderService,
		// private _countryService: CountriesService,
		// private _facilityService: FacilitiesService,
	) { }

	ngOnInit() {
		// this.facility = <Facility>this._locker.getObject('selectedFacility');
		// this.user = this._locker.getObject('auth');
		
		// this._getGenders();
		// this._getCountries();

		// this.newRequestForm = this._fb.group({
		// 	firstName: ['', [<any>Validators.required]],
		// 	lastName: ['', [<any>Validators.required]],
		// 	phone: ['', [<any>Validators.required]],
		// 	address: ['', [<any>Validators.required]],
		// 	dob: ['', [<any>Validators.required]],
		// 	age: [{value: '', disabled: true}, [<any>Validators.required]],
		// 	gender: ['', [<any>Validators.required]],
		// 	labNumber: ['', [<any>Validators.required]],
		// 	nationality: ['', [<any>Validators.required]],
		// 	state: ['', [<any>Validators.required]],
		// 	lga: ['', [<any>Validators.required]]
		// });
	}

	// Save new request
	// onClickSaveRequest(value: any, valid: boolean) {
	// 	console.log(value);
	// 	console.log(valid);
	// }

	// // Get all states
	// private _getCountries() {
	// 	this._countryService.find({ query: { facilityId: this.facility._id }})
	// 		.then(res => {
	// 			console.log(res);
	// 		}).catch(err => { console.log(err); });
	// }

	// // Get all genders
	// private _getGenders() {
	// 	this._genderService.find({ query: { facilityId: this.facility._id }})
	// 		.then(res => {
	// 			console.log(res);
	// 		}).catch(err => { console.log(err); });
	// }

	panelShow() {
		this.isPanel = !this.isPanel;
	}
	clickParent() {
		this.isParent = !this.isParent;
	}
 
}
