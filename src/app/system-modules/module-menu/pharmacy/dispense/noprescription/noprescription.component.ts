import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, Appointment } from '../../../../../models/index';
import { Clients } from '../../../../../shared-module/helpers/global-config';
import { PharmacyEmitterService } from '../../../../../services/facility-manager/pharmacy-emitter.service';
import { FacilitiesService, PrescriptionService,
	 DispenseService, ProductService, FacilityPriceService } from '../../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-noprescription',
	templateUrl: './noprescription.component.html',
	styleUrls: ['./noprescription.component.scss']
})
export class NoprescriptionComponent implements OnInit {
	@Input() selectedAppointment: Appointment = <Appointment>{};
	@Input() employeeDetails: any;
	facility: Facility = <Facility>{};

	noPrescriptionForm: FormGroup;
	units: string[] = [];
	minorLocations: string[] = [];
	drugs: any[] = [];
	selectedDrugs: any[] = [];
	departments: string[] = [];
	clients: any[] = [];
	selectedDept: string = '';
	selectedClient: string = '';
	corporateShow: boolean = false;
	individualShow: boolean = false;
	internalShow: boolean = false;
	prescriptions: any[] = [];
	prescription = {};
	storeId: string = '';
	// search variables
	searchText: string = '';
	cuDropdownLoading: boolean = false;
	selectedDrugId: string = "";
	showCuDropdown: boolean = false;

	constructor(
		private _fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		private _facilityService: FacilitiesService,
		private _dispenseService: DispenseService,
		private _productService: ProductService,
		private _facilityPriceService: FacilityPriceService 
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
		let drug = {
			productId: value.drug
		};
		// put selected drugs in the selectedDrugs array.
		this.selectedDrugs.push(drug);

		this.prescription = {
			client: value.client,
			//employeeId: this.employeeDetails.employeeDetails._id,
			employeeId: '',
			drugs: this.selectedDrugs
		}
		switch (value.client) {
			case 'Individual':
				this.prescription['lastName'] = value.lastName;
				this.prescription['firstName'] = value.firstName;
				this.prescription['phoneNumber'] = value.phone;
				break;
			case 'Corporate':
				this.prescription['companyName'] = value.companyName;
				this.prescription['companyPhone'] = value.companyPhone;
				break;
			case 'Internal':
				this.prescription['departmentId'] = value.dept;
				this.prescription['unitId'] = value.unit;
				this.prescription['locationId'] = value.minorLocation;
				break;
		}
		this.prescription['qty'] = value.qty;
		this.prescription['totalQuantity'] = '';
		this.prescription['totalCost'] = '';
		console.log(this.prescription);
		
		this.prescriptions.push(this.prescription);	
	}

	// Save Nonpresciption form data in to the database.
	onClickDispense() {
		let payload = {
			facilityId: this.facility._id,
			nonPrescription: this.prescription,
			storeId: this.storeId
		}

		console.log(payload);

		// this._dispenseService.create(this.prescriptions)
		// 	.then(res => {
		// 		console.log(res);
		// 		this._facilityService.announceNotification({
		// 			type: "Success",
		// 			text: "Prescription has been sent!"
		// 		});
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	});
	}

	// Search for products in the product service.
	keyupSearch() {
		this.noPrescriptionForm.controls['drug'].valueChanges.subscribe(val => {
			this.searchText = val;
		});
		//this.drugs = [];
		this.cuDropdownLoading = true;
		this._productService.find({ query: { "name": this.searchText } })
			.then(res => {
				console.log(res);
				this.cuDropdownLoading = false;
				//this.drugs = res;
			})
			.catch(err => {
				this.cuDropdownLoading = false;
				console.log(err);
			});
	}

	onClickCustomSearchItem(event, drugId) {
		this.noPrescriptionForm.controls['drug'].setValue(event.srcElement.innerText);
		let productId = drugId.getAttribute('data-drug-id');
	}

	focusSearch() {
		this.showCuDropdown = !this.showCuDropdown;
	}

	focusOutSearch() {
		setTimeout(() => {
			this.showCuDropdown = !this.showCuDropdown;
		}, 300);
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
		// Once changed, reset all variables
		this.selectedDrugs = [];
		this.prescriptions = [];
		this.prescription = {};

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
