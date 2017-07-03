import { Component, OnInit, Input, ElementRef } from '@angular/core';
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
	products: any[] = [];
	selectedProducts: any[] = [];
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
	selectedProductId: string = "";
	showCuDropdown: boolean = false;
	price: number = 0;
	itemPrice: number = 0;
	itemQuantity: number = 0;
	totalItemPrice: number = 0;
	totalItemQuantity: number = 0;

	constructor(
		private _fb: FormBuilder,
		private _el: ElementRef,
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
			product: ['', [<any>Validators.required]],
			batchNumber: ['', [<any>Validators.required]],
			qty: [0, [<any>Validators.required]],
			cost: ['']
		});

		this.noPrescriptionForm.controls['dept'].valueChanges.subscribe(val => {
			this.selectedDept = val;
			this.getFacilityData();
		});

		this.noPrescriptionForm.controls['qty'].valueChanges.subscribe(val => {
			if(val > 0) {
				//this.itemPrice = this.price*val;
				this.itemQuantity = val;
				this.itemPrice = this.price*val;
				this.noPrescriptionForm.controls['cost'].setValue(this.itemPrice);
			} else {
				this._facilityService.announceNotification({
					type: "Error",
					text: "Quantity should be greater than 0!"
				});
			}
		});
	}

	// Add items to the prescriptions array.
	onClickSaveNoPrescription(value: any, valid: boolean) {
		let prescription = {};

		if(value.drug == '' || value.qty == '' || value.batchNumber == '') {
			this._facilityService.announceNotification({
				type: "Error",
				text: "Some fields are empty!"
			});
		} else {
			switch (value.client) {
				case 'Individual':
					prescription['lastName'] = value.lastName;
					prescription['firstName'] = value.firstName;
					prescription['phoneNumber'] = value.phone;
					break;
				case 'Corporate':
					prescription['companyName'] = value.companyName;
					prescription['companyPhone'] = value.companyPhone;
					break;
				case 'Internal':
					prescription['departmentId'] = value.dept;
					prescription['unitId'] = value.unit;
					prescription['locationId'] = value.minorLocation;
					break;
			}
			this.totalItemPrice = this.totalItemPrice + this.itemPrice;
			this.totalItemQuantity = this.totalItemQuantity + this.itemQuantity;
			prescription['productName'] = value.product;
			prescription['productId'] = this.selectedProductId;
			prescription['client'] = value.client;
			prescription['qty'] = value.qty;
			prescription['cost'] = value.cost;
			prescription['batchNumber'] = value.batchNumber;
			prescription['totalQuantity'] = this.totalItemQuantity;
			prescription['totalCost'] = this.totalItemPrice;
			console.log(prescription);
			
			this.prescriptions.push(prescription);
		}	
	}

	// Save Nonpresciption form data in to the database.
	onClickDispense() {
		let prescription = {};
		let drugs = [];

		this.prescriptions.forEach(element => {
			let product = {};
			console.log(element);
			switch (element.client) {
				case 'Individual':
					prescription['lastName'] = element.lastName;
					prescription['firstName'] = element.firstName;
					prescription['phoneNumber'] = element.phoneNumber;
					break;
				case 'Corporate':
					prescription['companyName'] = element.companyName;
					prescription['companyPhone'] = element.companyPhone;
					break;
				case 'Internal':
					prescription['departmentId'] = element.dept;
					prescription['unitId'] = element.unit;
					prescription['locationId'] = element.minorLocation;
					break;
			}
			product['productId'] = element.productId;
			product['batchNumber'] = element.batchNumber;
			product['productName'] = element.productName;
			product['cost'] = element.cost;
			product['quantity'] = element.qty;
			prescription['client'] = element.client;
			prescription['client'] = element.client;
			prescription['employeeId'] = this.employeeDetails.employeeDetails._id;
			prescription['totalQuantity'] = this.totalItemQuantity;
			prescription['totalCost'] = this.totalItemPrice;
			drugs.push(product);
		});
		prescription['drugs'] = drugs;

		let payload = {
			facilityId: this.facility._id,
			nonPrescription: prescription,
			storeId: this.storeId
		}

		console.log(payload);

		this._dispenseService.create(payload)
			.then(res => {
				console.log(res);
				// Once changed, reset all variables
				this.selectedProducts = [];
				this.prescriptions = [];
				this.prescription = {};
				this.totalItemPrice = 0;
				this.itemPrice = 0;
				this.totalItemQuantity = 0;
				this.itemQuantity = 0;
				this.price = 0;
				this.noPrescriptionForm.reset();
				this.noPrescriptionForm.controls['qty'].reset(0);
				this.noPrescriptionForm.controls['client'].reset(this.clients[0].name);
				this._facilityService.announceNotification({
					type: "Success",
					text: "Prescription has been sent!"
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	// Search for products in the product service.
	keyupSearch() {
		this.noPrescriptionForm.controls['product'].valueChanges.subscribe(val => {
			this.searchText = val;
		});

		if (this.searchText.length > 2) {
			this.products = [];
			this.cuDropdownLoading = true;
		
			this._productService.find({ query: { facilityId : this.facility._id }})
				.then(res => {
					let tempArray = [];
					// Get all products in the facility, then search for the item you are looing for.
					res.data.forEach(element => {
						if(element.name.toLowerCase().includes(this.searchText.toLowerCase())) {
							tempArray.push(element);
						}
					});
					console.log(tempArray);
					if(tempArray.length !== 0) {
						this.products = tempArray;
						this.cuDropdownLoading = false;
					} else {
						this.products = [];
						this.cuDropdownLoading = false;
					}
				})
				.catch(err => {
					this.cuDropdownLoading = false;
					console.log(err);
				});
		}
	}

	onClickCustomSearchItem(event, drugId) {
		this.noPrescriptionForm.controls['product'].setValue(event.srcElement.innerText);
		this.selectedProductId = drugId.getAttribute('data-p-id');
		let fsId = drugId.getAttribute('data-p-fsid');
		let sId = drugId.getAttribute('data-p-sid');
		let cId = drugId.getAttribute('data-p-cid');
		// Get the service for the product
		this._facilityPriceService.find({ query : { facilityId : this.facility._id, facilityServiceId: fsId, serviceId: sId, categoryId: cId}})
			.then(res => {
				console.log(res);
				if(res.data.length > 0) {
					if(res.data[0].price !== undefined) {
						this.price = res.data[0].price;
					}
				}
			})
			.catch(err => {
				console.log(err);
			})
	}

	// Delete item from stack
	onClickDeleteItem(index, item) {
		this.prescriptions.splice(index, 1);
		this.totalItemPrice = this.totalItemPrice - item.cost;
		this.totalItemQuantity = this.totalItemQuantity - item.qty;
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
		this.selectedProducts = [];
		this.prescriptions = [];
		this.prescription = {};
		this.totalItemPrice = 0;
		this.itemPrice = 0;
		this.totalItemQuantity = 0;
		this.itemQuantity = 0;
		this.price = 0;
		this.noPrescriptionForm.reset();
		this.noPrescriptionForm.controls['qty'].reset(0);
		this.noPrescriptionForm.controls['client'].reset(param);

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
