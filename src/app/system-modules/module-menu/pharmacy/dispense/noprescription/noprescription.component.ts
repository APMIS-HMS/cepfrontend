import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Facility, Appointment } from '../../../../../models/index';
import { Clients } from '../../../../../shared-module/helpers/global-config';
import { PharmacyEmitterService } from '../../../../../services/facility-manager/pharmacy-emitter.service';
import { FacilitiesService, PrescriptionService, InventoryService, EmployeeService, PurchaseEntryService,
	 // tslint:disable-next-line:max-line-length
	 DispenseService, ProductService, FacilityPriceService, AssessmentDispenseService } from '../../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-noprescription',
	templateUrl: './noprescription.component.html',
	styleUrls: ['./noprescription.component.scss']
})
export class NoprescriptionComponent implements OnInit {
	@Input() selectedAppointment: Appointment = <Appointment>{};
	@Input() employeeDetails: any;
	facility: Facility = <Facility>{};
	user: any = <any>{};

	noPrescriptionForm: FormGroup;
	units: string[] = [];
	minorLocations: string[] = [];
	products: any[] = [];
	selectedProducts: any[] = [];
	departments: string[] = [];
	clients: any[] = [];
	selectedDept = '';
	selectedClient = '';
	corporateShow = false;
	individualShow = false;
	internalShow = false;
	prescriptions: any[] = [];
	prescription = {};
	storeId = '';
	// search variables
	searchText = '';
	cuDropdownLoading = false;
	selectedProductId = '';
	showCuDropdown = false;
	price = 0;
	itemPrice = 0;
	itemQuantity = 0;
	totalItemPrice = 0;
	totalItemQuantity = 0;

	constructor(
		private _fb: FormBuilder,
		private _el: ElementRef,
		private _locker: CoolSessionStorage,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		private _facilityService: FacilitiesService,
		private _dispenseService: DispenseService,
		private _productService: ProductService,
		private _facilityPriceService: FacilityPriceService,
		private _inventoryService: InventoryService,
		private _employeeService: EmployeeService,
		private _purchaseEntryService: PurchaseEntryService,
		private _assessmentDispenseService: AssessmentDispenseService
	) {

	}

	ngOnInit() {
		this._pharmacyEventEmitter.setRouteUrl('Dispense');
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.user = this._locker.getObject('auth');

		if (this.employeeDetails.storeCheckIn !== undefined) {
			this.storeId = this.employeeDetails.storeCheckIn[0].storeId;
		}

		this.clients = Clients;
		this.selectedClient = Clients[0].name;
		this.individualShow = true;

		this.getFacilityData();

		// Nonprescription form group
		this.noPrescriptionForm = this._fb.group({
			client: ['', [<any>Validators.required]],
			lastName: [''],
			firstName: [''],
			phone: [''],
			companyName: [''],
			companyPhone: [''],
			dept: ['', [<any>Validators.required]],
			unit: ['', [<any>Validators.required]],
			minorLocation: ['', [<any>Validators.required]],
			product: ['', [<any>Validators.required]],
			batchNumber: [{value: '', disabled: true}, [<any>Validators.required]],
			qty: [0, [<any>Validators.required]],
			cost: ['']
		});

		this.noPrescriptionForm.controls['dept'].valueChanges.subscribe(val => {
			this.selectedDept = val;
			this.getFacilityData();
		});

		this.noPrescriptionForm.controls['qty'].valueChanges.subscribe(val => {
			if (val > 0) {
				// this.itemPrice = this.price*val;
				this.itemQuantity = val;
				this.itemPrice = this.price * val;
				this.noPrescriptionForm.controls['cost'].setValue(this.itemPrice);
			} else {
				this._facilityService.announceNotification({
					users: [this.user._id],
					type: 'Error',
					text: 'Quantity should be greater than 0!'
				});
			}
		});
	}

	// Add items to the prescriptions array.
	onClickSaveNoPrescription(value: any, valid: boolean) {
		const prescription = {};

		// if(this.storeId !== '') {
			if (value.drug === '' || value.qty === '' || value.batchNumber === '') {
				this._facilityService.announceNotification({
					users: [this.user._id],
					type: 'Error',
					text: 'Some fields are empty!'
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
				prescription['cost'] = value.cost * value.qty;
				prescription['unitPrice'] = value.cost;
				prescription['batchNumber'] = this.noPrescriptionForm.controls['batchNumber'].value;
				prescription['totalQuantity'] = this.totalItemQuantity;
				prescription['totalCost'] = this.totalItemPrice;
				console.log(prescription);

				this.prescriptions.push(prescription);
			}
		// } else {
		// 	this._facilityService.announceNotification({
		// 		type: "Error",
		// 		text: "You need to check into store."
		// 	});
		// }
	}

	// Save Nonpresciption form data in to the database.
	onClickDispense() {
		if (this.storeId !== '') {
			const prescription = {};
			const drugs = [];

			this.prescriptions.forEach(element => {
				const product = {};
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

			const payload = {
				facilityId: this.facility._id,
				nonPrescription: prescription,
				isPrescription: false,
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
						users: [this.user._id],
						type: 'Success',
						text: 'Prescription has been sent!'
					});
				})
				.catch(err => {
					console.log(err);
				});
		} else {
			this._facilityService.announceNotification({
				users: [this.user._id],
				type: 'Error',
				text: 'You need to check into store.'
			});
		}
	}

	// Search for products in the product service.
	keyupSearch() {
		this.noPrescriptionForm.controls['product'].valueChanges.subscribe(val => {
			this.searchText = val;
		});

		if (this.searchText.length > 2) {
			this.products = [];
			this.cuDropdownLoading = true;

			if (this.storeId !== '') {
				// this._productService.find({ query: { facilityId : this.facility._id }})
				this._inventoryService.find({ query: { facilityId : this.facility._id, storeId: this.storeId }})
					.then(res => {
						console.log(res);
						const tempArray = [];
						// Get all products in the facility, then search for the item you are looing for.
						res.data.forEach(element => {
							if (
								(element.totalQuantity > 0) &&
								element.productObject.name.toLowerCase().includes(this.searchText.toLowerCase())
							) {
								tempArray.push(element);
							}
						});
						console.log(tempArray);
						if (tempArray.length !== 0) {
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
			} else {
				this._facilityService.announceNotification({
					users: [this.user._id],
					type: 'Error',
					text: 'You need to check into store.'
				});
			}
		}
	}

	onClickCustomSearchItem(event, drugId) {
		this.noPrescriptionForm.controls['product'].setValue(event.srcElement.innerText);
		this.selectedProductId = drugId.getAttribute('data-p-id');
		const fsId = drugId.getAttribute('data-p-fsid');
		const sId = drugId.getAttribute('data-p-sid');
		const cId = drugId.getAttribute('data-p-cid');
		const batchNumber = drugId.getAttribute('data-p-batchNumber');
		this.price = drugId.getAttribute('data-p-costPrice');
		this.noPrescriptionForm.controls['batchNumber'].setValue(batchNumber);
		// Get the selling price for the product
		// this._facilityPriceService.find({ query : {
		// 		facilityId : this.facility._id,
		// 		productId: this.selectedProductId,
		// 		facilityServiceId: fsId,
		// 		serviceId: sId, categoryId: cId
		// 	}})
		this._assessmentDispenseService.find({ query : {
				facilityId : this.facility._id,
				productId: this.selectedProductId,
				facilityServiceId: fsId,
				serviceId: sId, categoryId: cId
			}})
			.then(res => {
				console.log(res);
				if (res.data.length > 0) {
					if (res.data[0].price !== undefined) {
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
					const dept = res.departments[i];
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
