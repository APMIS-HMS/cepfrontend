import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Facility, Appointment, BatchTransaction } from '../../../../../models/index';
import { Clients } from '../../../../../shared-module/helpers/global-config';
import { PharmacyEmitterService } from '../../../../../services/facility-manager/pharmacy-emitter.service';
import { FacilitiesService, PrescriptionService, InventoryService, EmployeeService, PurchaseEntryService,
	 InventoryTransactionTypeService,
	 DispenseService, ProductService, FacilityPriceService, AssessmentDispenseService } from '../../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-noprescription',
	templateUrl: './noprescription.component.html',
	styleUrls: ['./noprescription.component.scss']
})
export class NoprescriptionComponent implements OnInit {
	@Input() selectedAppointment: Appointment = <Appointment>{};
	facility: Facility = <Facility>{};
	user: any = <any>{};

	employeeDetails: any = <any>{};
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
	transactions: any = {};
	batches: any[] = [];
	prescription = {};
	storeId: any = <any>{};
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
	selectedBatch: string = '';
	disableDispenseBtn: boolean = false;
	dispenseAllBtn: boolean = false;
	qtyDispenseBtn: string = 'Bill';
	inventoryTransactionTypeId: string = '';

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
		private _assessmentDispenseService: AssessmentDispenseService,
		private _inventoryTransactionTypeService: InventoryTransactionTypeService
	) {

	}

	ngOnInit() {
		this._pharmacyEventEmitter.setRouteUrl('Dispense');
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.storeId = this._locker.getObject('checkingObject');
		this.employeeDetails = this._locker.getObject('loginEmployee');
		this.user = this._locker.getObject('auth');
		console.log(this.user);

		// if (this.employeeDetails.storeCheckIn !== undefined) {
		// 	this.storeId = this.employeeDetails.storeCheckIn[0].storeId;
		// }

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
			batchNumber: ['', [<any>Validators.required]],
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

		if(this.prescriptions.length === 0) {
			this.dispenseAllBtn = true;
		} else {
			this.prescriptions.forEach(x => {
				if(!x.isBilled) {
					this.dispenseAllBtn = false;
				}
			});
		}
	}

	// Add items to the prescriptions array.
	onClickSaveNoPrescription(value: any, valid: boolean) {
		console.log(value);
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
				prescription['cost'] = this.price * value.qty;
				prescription['unitPrice'] = this.price;
				prescription['batchNumber'] = this.selectedBatch;
				prescription['batchNumberId'] = value.batchNumber;
				prescription['totalQuantity'] = this.totalItemQuantity;
				prescription['totalCost'] = this.totalItemPrice;
				prescription['isBilled'] = false;
				console.log(prescription);

				this.prescriptions.push(prescription);

				// Empty the form
				this.price = 0;
				this
				this.noPrescriptionForm.controls['drug'].setValue('');
				this.noPrescriptionForm.controls['batchNumber'].setValue('');
				this.noPrescriptionForm.controls['qty'].setValue(1);
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
				product['batchNumberId'] = element.batchNumberId;
				product['productName'] = element.productName;
				product['cost'] = element.unitPrice;
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
				this._inventoryService.find({ query: { facilityId : this.facility._id, storeId: this.storeId.typeObject.storeId }})
					.then(res => {
						console.log(res);
						// Get all products in the facility, then search for the item you are looing for.
						const contains = res.data.filter(x => (x.totalQuantity > 0) && x.productObject.name.toLowerCase().includes(this.searchText.toLowerCase()));
						if (contains.length !== 0) {
							this.products = contains;
							this.batches = contains[0].transactions;
							this.cuDropdownLoading = false;
						} else {
							this.products = [];
							this.batches = [];
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
		// const fsId = drugId.getAttribute('data-p-fsid');
		// const sId = drugId.getAttribute('data-p-sid');
		// const cId = drugId.getAttribute('data-p-cid');
		//const batchNumber = drugId.getAttribute('data-p-batchNumber');
		//this.price = drugId.getAttribute('data-p-costPrice');
		//this.noPrescriptionForm.controls['batchNumber'].setValue(batchNumber);
		// Get the selling price for the product
		// this._facilityPriceService.find({ query : {
		// 		facilityId : this.facility._id,
		// 		productId: this.selectedProductId,
		// 		facilityServiceId: fsId,
		// 		serviceId: sId, categoryId: cId
		// 	}})
		// this._assessmentDispenseService.find({ query : {
		// 		facilityId : this.facility._id,
		// 		productId: this.selectedProductId,
		// 		facilityServiceId: fsId,
		// 		serviceId: sId, categoryId: cId
		// 	}})
		// 	.then(res => {
		// 		console.log(res);
		// 		if (res.data.length > 0) {
		// 			if (res.data[0].price !== undefined) {
		// 				this.price = res.data[0].price;
		// 			}
		// 		}
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	})
	}

	onClickBatchSelect(event, batchId) {
		this.price = batchId._element.nativeElement.getAttribute('data-p-price');
		this.selectedBatch = batchId._element.nativeElement.getAttribute('data-p-batch');
	}

	// onClickBillProduct(prescription) {
	// 	console.log(prescription);
	// 	this.disableDispenseBtn = true;
	// 	this.qtyDispenseBtn = "Billing... <i class='fa fa-spinner fa-spin'></i>";

	// 	 this._inventoryService.find({ query: { 
	// 				facilityId: this.facility._id, 
	// 				productId: prescription.productId, storeId: this.storeId.typeObject.storeId 
	// 			}})
	// 		.then(res => {
	// 			this.transactions = res.data[0];
	// 			if(res.data.length > 0) {
	// 				console.log(res.data[0]);
	// 				this.transactions = res.data[0];
	// 				//Deduct from the batches before updating the batches in the inventory.
	// 				this.transactions.transactions.forEach(element => {
	// 					if(element._id === prescription.batchNumberId) {
	// 						let batchTransaction: BatchTransaction = {
	// 							batchNumber: prescription.batchNumber,
	// 							employeeId: this.employeeDetails.employeeDetails._id,
	// 							employeeName: this.employeeDetails.employeeDetails.personFullName,
	// 							preQuantity: element.quantity, // Before Operation.
	// 							postQuantity: element.quantity - prescription.qty, // After Operation.
	// 							quantity: prescription.qty, // Operational qty.
	// 							referenceId: 'Dispense', // Dispense id, Transfer id...
	// 							referenceService: 'Prescription/Dispense Service', // Dispense, Transfer...
	// 							inventorytransactionTypeId: this.inventoryTransactionTypeId,
	// 						}
	// 						element.batchTransactions.push(batchTransaction);
	// 						element.quantity = element.quantity - prescription.qty;
	// 					}
	// 				});
	// 				this.transactions.totalQuantity = this.transactions.totalQuantity - prescription.qty;

	// 				this._inventoryService.patch(res.data[0]._id, res.data[0], {})
	// 					.then(res => {
	// 						prescription.isBilled = true;
	// 						// disable the dispense button.
	// 						this.disableDispenseBtn = false;
	// 						this.qtyDispenseBtn = "Dispense";
	// 						console.log(res);
	// 						this._notification('Success', 'Quantity has been deducted.');
	// 					})
	// 					.catch(err => {
	// 						console.log(err);
	// 					});
	// 			} else {
	// 				this.disableDispenseBtn = false;
	// 				this.qtyDispenseBtn = "Dispense";
	// 				this._notification('Error', 'Sorry, This process can not be performed at the moment.');
	// 			}
	// 		})
	// 		.catch(err => {
	// 			console.log(err);
	// 		});
	// }

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

	// Get all the inventory transaction types.
	private _getInventoryTransactionTypes() {
		this._inventoryTransactionTypeService.findAll()
			.then(res => {
				if(res.data.length > 0) {
					const inventoryType = res.data.filter(x => x.name.toLowerCase().includes('dispense'));
					this.inventoryTransactionTypeId = inventoryType[0]._id;
				}
			})
			.catch(err => { console.log(err); });
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
