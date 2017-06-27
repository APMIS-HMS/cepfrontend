import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from '../../../../../models/index';
import { Clients } from '../../../../../shared-module/helpers/global-config';
import { PharmacyEmitterService } from '../../../../../services/facility-manager/pharmacy-emitter.service';
import { FacilitiesService, PrescriptionService } from '../../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-noprescription',
	templateUrl: './noprescription.component.html',
	styleUrls: ['./noprescription.component.scss']
})
export class NoprescriptionComponent implements OnInit {
	facility: Facility = <Facility>{};

	noPrescriptionForm: FormGroup;
	units: string[] = [];
	minorLocations: string[] = [];
	drugs: any[] = [];
	departments: string[] = [];
	clients: any[] = [];
	selectedDept: string = '';
	selectedClient: string = '';
	corporateShow: boolean = false;
	individualShow: boolean = false;
	internalShow: boolean = false;
	prescriptions: any[] = [];

	constructor(
		private _fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		private _facilityService: FacilitiesService,
		private _dispenseService: FacilitiesService
	) {

	}

	ngOnInit() {
		this._pharmacyEventEmitter.setRouteUrl('Dispense');
		this.facility = <Facility>this._locker.getObject('selectedFacility');

		this.clients = Clients;
		this.selectedClient = Clients[0].name;
		this.individualShow = true;

		this.getFacilityData();

		// Nonprescription form group
		this.noPrescriptionForm = this._fb.group({
			client: ['', [<any>Validators.required]],
			lastName: ['', [<any>Validators.required]],
			firstName: ['', [<any>Validators.required]],
			phone: [''],
			companyName: ['', [<any>Validators.required]],
			companyPhone: [''],
			dept: ['', [<any>Validators.required]],
			unit: ['', [<any>Validators.required]],
			minorLocation: ['', [<any>Validators.required]],
			drug: ['', [<any>Validators.required]],
			qty: ['', [<any>Validators.required]]
		});

		this.noPrescriptionForm.controls['dept'].valueChanges.subscribe(val => {
			this.selectedDept = val;
			this.getFacilityData();
		});
	}

	// Add items to the prescriptions array.
	onClickSaveNoPrescription(value: any, valid: boolean) {
		console.log(value);
		let payload = {};
		switch (value.client) {
			case 'Individual':
				payload['lastname'] = value.lastName;
				payload['firstname'] = value.firstName;
				payload['phone'] = value.phone;
				break;
			case 'Corporate':
				payload['companyName'] = value.companyName;
				payload['companyPhone'] = value.companyPhone;
				break;
			case 'Internal':
				payload['department'] = value.dept;
				payload['unit'] = value.unit;
				payload['minorLocation'] = value.minorLocation;
				break;
		}

		payload['client'] = value.client;
		payload['drug'] = value.drug;
		payload['qty'] = value.qty;
		console.log(payload);
		this.prescriptions.push(payload);	
	}

	// Save Nonpresciption form data in to the database.
	onClickDispense() {
		console.log(this.prescriptions);

		// this._dispenseService.create(this.prescriptions)
		// 	.then(res => {
		// 		console.log(res);
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	});
	}

	// Get facility data then extract the departments, minorlocations, and units.
	getFacilityData() {
		this._facilityService.get(this.facility._id, {})
			.then(res => {
				this.departments = res.departments;
				this.minorLocations = res.minorLocations;

				for (let i = 0; i < res.departments.length; i++) {
					let dept = res.departments[i];
					if (dept._id === this.selectedDept) {
						this.units = dept.units;
						return;
					}
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	onChange(param) {
		switch (param) {
			case 'Individual':
				this.individualShow = true;
				this.corporateShow = false;
				this.internalShow = false;
				break;
			case 'Corporate':
				this.individualShow = false;
				this.corporateShow = true;
				this.internalShow = false;
				break;
			case 'Internal':
				this.individualShow = false;
				this.corporateShow = false;
				this.internalShow = true;
				break;
		}
	}
}
