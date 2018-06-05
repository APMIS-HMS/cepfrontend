import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, Appointment, BatchTransaction, Employee, BillItem, BillIGroup, Department } from '../../../../../models/index';
import { Clients } from '../../../../../shared-module/helpers/global-config';
import { PharmacyEmitterService } from '../../../../../services/facility-manager/pharmacy-emitter.service';
import {
	FacilitiesService, PrescriptionService, InventoryService, EmployeeService, PurchaseEntryService,
	InventoryTransactionTypeService, BillingService, InvoiceService,
	DispenseService, ProductService, FacilityPriceService, AssessmentDispenseService
}
	from '../../../../../services/facility-manager/setup/index';
import { Observable } from 'rxjs/Observable';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { SystemModuleService } from '../../../../../services/module-manager/setup/system-module.service';

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
	selectedProduct: any;
	departments: Department[] = [];
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
	selectedStore: any;
	// search variables
	searchText = '';
	cuDropdownLoading = false;
	selectedProductId = '';
	showCuDropdown = false;
	price = 0;
	totalPrice = 0;
	totalQuantity = 0;
	selectedBatch = '';
	disableDispenseBtn = false;
	dispenseBtn = true;
  dispensingBtn = false;
	inventoryTransactionTypeId = '';
	selectedInventoryId = '';
	selectedFsId = '';
	selectedSId = '';
	selectedCId = '';
	internalType = 'Department';
	deptLocationShow = true;

	loading = false;

	constructor(
		private _fb: FormBuilder,
		private _el: ElementRef,
		private _locker: CoolLocalStorage,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		private _facilityService: FacilitiesService,
		private _dispenseService: DispenseService,
		private _productService: ProductService,
		private _facilityPriceService: FacilityPriceService,
		private _inventoryService: InventoryService,
		private _employeeService: EmployeeService,
		private _purchaseEntryService: PurchaseEntryService,
		private _assessmentDispenseService: AssessmentDispenseService,
		private _inventoryTransactionTypeService: InventoryTransactionTypeService,
		private _billingService: BillingService,
		private _invoiceService: InvoiceService,
		private _facilityPriceServices: FacilityPriceService,
		private _authFacadeService: AuthFacadeService,
		private _systemModuleService: SystemModuleService
	) {
    this._authFacadeService.getLogingEmployee().then(res => {
      this.employeeDetails = res;
      if (!!this.employeeDetails.storeCheckIn && this.employeeDetails.storeCheckIn.length > 0) {
        this.selectedStore = this.employeeDetails.storeCheckIn.filter(x => x.isOn)[0];
      }
    }).catch(err => console.log(err));
	}

	ngOnInit() {
		this._pharmacyEventEmitter.setRouteUrl('Dispense');
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.user = this._locker.getObject('auth');

		this.clients = Clients;
		this.selectedClient = Clients[0].name;
		this.individualShow = true;

		this.getFacilityData();
		this._getInventoryTransactionTypes();

		// Nonprescription form group
		this.noPrescriptionForm = this._fb.group({
			client: ['', [<any>Validators.required]],
			lastName: [''],
			firstName: [''],
			phone: [''],
			companyName: [''],
			companyPhone: [''],
			dept: [''],
			unit: [''],
			minorLocation: [''],
			product: ['', [<any>Validators.required]],
			batchNumber: ['', [<any>Validators.required]],
			qty: [1, [<any>Validators.required, this._minValue(1)]],
			cost: ['']
		});

		this.noPrescriptionForm.controls['qty'].valueChanges.subscribe(val => {
			if (val > 0) {
				this.noPrescriptionForm.controls['cost'].setValue(this.price);
			}
		});

		// Disable dispense button if there are no items in the prescription array.
		if (this.prescriptions.length === 0) {
			this.disableDispenseBtn = true;
		} else {
			this.disableDispenseBtn = false;
		}
	}

	// Add items to the prescriptions array.
	onClickSaveNoPrescription(value: any, valid: boolean) {
		const prescription = {};
		if (valid) {
			if (!!this.selectedStore) {
				if (value.drug === '' || value.qty === '' || value.qty === 0 || value.batchNumber === '') {
					this._systemModuleService.announceSweetProxy('Some fields are empty or Quantity is less than 1!', 'error');
          			// this._notification('Error', 'Some fields are empty or Quantity is less than 1!');
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
							if (this.internalType.toLowerCase() === 'department') {
								prescription['department'] = {
									id: value.dept._id,
									name: value.dept.name
								};
								prescription['unit'] = {
									id: value.unit._id,
									name: value.unit.name
								};
							} else {
								prescription['location'] = {
									id: value.minorLocation._id,
									name: value.minorLocation.name
								};
							}
							break;
					}
					this.disableDispenseBtn = false;
					this.totalPrice = Number(this.totalPrice) + (Number(this.price) * Number(value.qty));
					this.totalQuantity = Number(this.totalQuantity) + Number(value.qty);
					prescription['productName'] = value.product;
					prescription['productId'] = this.selectedProduct.productId;
					prescription['client'] = value.client;
					prescription['qty'] = value.qty;
					prescription['cost'] = this.price * value.qty;
					prescription['unitPrice'] = this.price;
					prescription['batchNumber'] = this.selectedBatch;
					prescription['batchNumberId'] = value.batchNumber;
					prescription['totalQuantity'] = this.totalQuantity;
					prescription['totalCost'] = this.totalPrice;
					prescription['inventoryId'] = this.selectedProduct._id;
					prescription['facilityServiceId'] = this.selectedProduct.facilityServiceId;
					prescription['serviceId'] = this.selectedProduct.serviceId;
					prescription['isBilled'] = false;

					this.prescriptions.push(prescription);

					// Empty the form
					this.price = 0;
					this.products = [];
					this.batches = [];
					this.noPrescriptionForm.controls['product'].setValue('');
					this.noPrescriptionForm.controls['batchNumber'].setValue('');
					this.noPrescriptionForm.controls['qty'].setValue(1);
				}
			} else {
        this._notification('Error', 'You need to check into store.');
			}
		} else {
      this._notification('Error', 'Some fields are empty or Quantity is less than 1!');
		}
	}

	// Save Nonpresciption form data in to the database.
	onClickDispense() {
		if (this.prescriptions.length > 0) {
			if (!!this.selectedStore) {
				const prescription = {};
				const drugs = [];
        this.dispenseBtn = false;
        this.dispensingBtn = true;
				this.disableDispenseBtn = true;

				this.prescriptions.forEach(element => {
					const product = {};
					switch (element.client) {
						case 'Individual':
							prescription['lastName'] = element.lastName;
							prescription['firstName'] = element.firstName;
							prescription['fullname'] = element.firstName + ' ' + element.lastName;
							prescription['phoneNumber'] = element.phoneNumber;
							prescription['client'] = {
								clientType: element.client,
								name: element.firstName + ' ' + element.lastName,
								phone: element.phoneNumber
							};
							break;
						case 'Corporate':
							prescription['companyName'] = element.companyName;
							prescription['fullname'] = element.companyName;
							prescription['companyPhone'] = element.companyPhone;
							prescription['client'] = {
								clientType: element.client,
								name: element.companyName,
								phone: element.companyPhone
							};
							break;
						case 'Internal':
							if (this.internalType.toLowerCase() === 'department') {
								prescription['department'] = {
									id: element.department.id,
									name: element.department.name
								};
								prescription['unit'] = {
									id: element.unit.id,
									name: element.unit.name
								};
								prescription['client'] = {
									clientType: element.client,
									internalType: this.internalType.toLowerCase(),
									department: {
										id: element.department.id,
										name: element.department.name
									},
									unit: {
										id: element.unit.id,
										name: element.unit.name
									}
								};
							} else {
								prescription['location'] = {
									id: element.minorLocation.id,
									name: element.minorLocation.name
								};
								prescription['client'] = {
									clientType: element.client,
									internalType: this.internalType.toLowerCase(),
									id: element.location.id,
									name: element.location.name
								};
							}
							// prescription['departmentId'] = element.dept;
							// prescription['unitId'] = element.unit;
							// prescription['locationId'] = element.minorLocation;
							// prescription['client'] = {
							// 	clientType: element.client,
							// 	name: element.dept,
							// 	phone: element.client
							// };
							break;
					}
					product['product'] = {
						id: element.productId,
						name: element.productName
					};
					product['batchNumber'] = element.batchNumber;
					product['batchNumberId'] = element.batchNumberId;
					product['productId'] = element.productId;
					product['productName'] = element.productName;
					product['cost'] = element.unitPrice;
					product['quantity'] = element.qty;
					product['inventoryId'] = element.inventoryId;
					product['referenceId'] = '';
					product['employeeId'] = this.employeeDetails._id;
          			product['employeeName'] = `${this.employeeDetails.firstName} ${this.employeeDetails.firstName}`;
					product['referenceService'] = 'NoPrescriptionService';
					product['inventorytransactionTypeId'] = this.inventoryTransactionTypeId;
					prescription['employee'] = {
						id: this.employeeDetails._id,
            			name: `${this.employeeDetails.firstName} ${this.employeeDetails.firstName}`
					};
					prescription['totalQuantity'] = this.totalQuantity;
					prescription['totalCost'] = this.totalPrice;
					drugs.push(product);
				});
				prescription['drugs'] = drugs;

				const payload = {
					facilityId: this.facility._id,
					nonPrescription: prescription,
					isPrescription: false,
					storeId: this.selectedStore.storeId
				}

				const collectionDrugs = { drugs: drugs };


				// Call a service to
				// this._dispenseCollectionDrugs.create(collectionDrugs).then(res => {
				// 	// bill model
				// 	const billItemArray = [];
				// 	let totalCost = 0;
				// 	const clientDetails: any = <any>{};
				// 	this.prescriptions.forEach((element, i) => {
				// 		if (i === 0) {
				// 			switch (element.client.toLowerCase()) {
				// 				case 'individual':
				// 					clientDetails.name = element.firstName + ' ' + element.lastName;
				// 					clientDetails.phone = element.phoneNumber;
				// 					break;
				// 				case 'corporate':
				// 					clientDetails.name = element.companyName;
				// 					clientDetails.phone = element.companyPhone;
				// 					break;
				// 				case 'internal':
				// 					clientDetails.dept = element.dept;
				// 					clientDetails.unit = element.unit;
				// 					clientDetails.location = element.minorLocation;
				// 					break;
				// 			}
				// 		}

				// 		const billItem = <BillItem>{
				// 			facilityServiceId: element.facilityServiceId,
				// 			serviceId: element.serviceId,
				// 			facilityId: this.facility._id,
				// 			description: element.productName,
				// 			quantity: element.qty,
				// 			totalPrice: element.cost * element.qty,
				// 			unitPrice: element.cost,
				// 			unitDiscountedAmount: 0,
				// 			totalDiscoutedAmount: 0,
				// 		};

				// 		totalCost += element.totalCost;
				// 		billItemArray.push(billItem);
				// 	});

				// 	const bill = <BillIGroup>{
				// 		facilityId: this.facility._id,
				// 		walkInClientDetails: clientDetails,
				// 		isWalkIn: true,
				// 		billItems: billItemArray,
				// 		discount: 0,
				// 		subTotal: totalCost,
				// 		grandTotal: totalCost,
				// 	}
				// 	// Create a bill.
				// 	this._billingService.create(bill).then(res => {
				// 		const billingIds = [];
				// 		// Get all the billing items
				// 		// res.drugs.forEach(element => {
				// 		// 	const ids = {
				// 		// 		productId: element._id,
				// 		// 		productName: element.productName
				// 		// 	}
				// 		// 	billingIds.push(ids);
				// 		// });

				// 		// const invoice = {
				// 		// 	facilityId: this.facility._id,
				// 		// 	walkInClientDetails: clientDetails,
				// 		// 	isWalkIn: true,
				// 		// 	billingIds: billingIds,
				// 		// 	payments: billingIds, // Don't know what to insert in this.
				// 		// 	paymentStatus: [{ type: Schema.Types.Mixed, required: true }], // waved, insurance, partpayment, paid
				// 		// 	paymentCompleted: true,
				// 		// 	invoiceNo: { type: String, require: false },
				// 		// 	totalDiscount: { type: Number, require: false },
				// 		// 	totalPrice: { type: Number, require: false },
				// 		// };
				// 		// // call the invoice service.
				// 		// this._invoiceService.create(invoice)
				// 		// 	.then(res => {
				// 		// 	})
				// 		// 	.catch(err => { console.log(err); });
				// 	}).catch(err => { console.log(err); });
				// }).catch(err => { console.log(err); });

				// // Call the dispense service.
				// this._dispenseService.create(payload).then(res => {
        //   this.dispenseBtn = true;
        //   this.dispensingBtn = false;
				// 	this.disableDispenseBtn = true;
				// 	this.selectedProducts = [];
				// 	this.prescriptions = [];
				// 	this.prescription = {};
				// 	this.totalPrice = 0;
				// 	this.totalQuantity = 0;
				// 	this.price = 0;
				// 	this.noPrescriptionForm.reset();
				// 	this.noPrescriptionForm.controls['qty'].reset(0);
				// 	this.noPrescriptionForm.controls['client'].reset(this.clients[0].name);
				// 	this._notification('Success', 'Prescription has been sent!');
				// }).catch(err => {
				// 	console.log(err);
				// });
			} else {
				this._notification('Error', 'You need to check into store.');
			}
		} else {
			this._notification('Error', 'Please use to "Save" button above to add drugs.');
		}
	}

	// Search for products in the product service.
	keyupSearch() {
		this.searchText = this.noPrescriptionForm.controls['product'].value;

		if (this.searchText.length > 2) {
			this.products = [];
			this.cuDropdownLoading = true;
			if (!!this.selectedStore) {
				this.noPrescriptionForm.controls['product'].valueChanges
				.debounceTime(400)
				.switchMap((term) => Observable.fromPromise(
					this._inventoryService.findList({
						query: { facilityId: this.facility._id, storeId: this.selectedStore.storeId, name: this.searchText }
					})
				)).subscribe((res: any) => {
					this.cuDropdownLoading = false;
					if (!!res.data && res.data.length > 0) {
						this.products = res.data;
					} else {
						this.products = [];
						this.batches = [];
						this.cuDropdownLoading = false;
					}
				});
			} else {
				this._notification('Error', 'You need to check into store.');
			}
		}
	}

	onClickCustomSearchItem(event, product) {
		console.log(product);
		this.noPrescriptionForm.controls['batchNumber'].reset();
		this.noPrescriptionForm.controls['product'].setValue(product.productObject.name);
		// this.selectedProductId = product.productId;
		// // this.selectedProductId = drugId.getAttribute('data-p-id');
		// this.selectedInventoryId = product._id;
		// this.selectedFsId = product.facilityServiceId;
		// this.selectedSId = product.serviceId;
		// this.selectedCId = product.categoryId;
		this.selectedProduct = product;
		this.batches = product.transactions;
	}

	onClickBatchSelect(event, batch) {
		console.log(batch);
		this.selectedBatch = batch;
		if (!!batch && !!batch._id) {
			this._facilityPriceServices.find({query: {
				facilityId: this.facility._id,
				serviceId: this.selectedProduct.serviceId,
				facilityServiceId: this.selectedProduct.facilityServiceId,
				categoryId: this.selectedProduct.categoryId
			}}).then(res => {
				console.log(res);
				if (res.data.length > 0) {
					this.price = res.data[0].price;
				}
			});
		}
	}

	// onClickBillProduct(prescription) {
	// 	this.disableDispenseBtn = true;
	// 	this.qtyDispenseBtn = "Billing... <i class='fa fa-spinner fa-spin'></i>";

	// 	 this._inventoryService.find({ query: {
	// 				facilityId: this.facility._id,
	// 				productId: prescription.productId, storeId: this.storeId.typeObject.storeId
	// 			}})
	// 		.then(res => {
	// 			this.transactions = res.data[0];
	// 			if(res.data.length > 0) {
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
	// 						this._notification('Success', 'Quantity has been deducted.');
	// 					})
	// 					.catch(err => {
	// 					});
	// 			} else {
	// 				this.disableDispenseBtn = false;
	// 				this.qtyDispenseBtn = "Dispense";
	// 				this._notification('Error', 'Sorry, This process can not be performed at the moment.');
	// 			}
	// 		})
	// 		.catch(err => {
	// 		});
	// }

	// Delete item from stack
	onClickDeleteItem(index, item) {
		this.prescriptions.splice(index, 1);
		this.totalPrice = this.totalPrice - item.cost;
		this.totalQuantity = this.totalQuantity - item.qty;
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
		this._facilityService.get(this.facility._id, {}).then(res => {
			this.departments = res.departments;
			this.minorLocations = res.minorLocations;
		}).catch(err => console.error(err));
	}

	onChangeDepartment(value) {
		const units = this.departments.find(x => x._id === value.value._id);
		this.units = units.units;
	}

	onChangeInternalType(value) {
		// Reset all three values before hide/show.
		this.noPrescriptionForm.controls['dept'].setValue('');
		this.noPrescriptionForm.controls['unit'].setValue('');
		this.noPrescriptionForm.controls['minorLocation'].setValue('');
		switch (value) {
			case 'Department':
				this.deptLocationShow = true;
				break;
			case 'Location':
				this.deptLocationShow = false;
				break;
		}
	}

	onChange(param) {
		// Once changed, reset all variables
		this.selectedProducts = [];
		this.prescriptions = [];
		this.prescription = {};
		this.totalPrice = 0;
		this.totalQuantity = 0;
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
		this._inventoryTransactionTypeService.findAll().then(res => {
			if (res.data.length > 0) {
				const inventoryType = res.data.filter(x => x.name.toLowerCase().includes('dispense'));
				this.inventoryTransactionTypeId = inventoryType[0]._id;
			}
		}).catch(err => { console.log(err); });
	}

	// Notification
	private _notification(type: string, text: string): void {
		this._facilityService.announceNotification({
			users: [this.user._id],
			type: type,
			text: text
		});
	}
	private _minValue(min: Number): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } => {
			const input = control.value,
				isValid = input < min;
			if (isValid) {
				return { 'maxValue': { min } }
			} else {
				return null;
			}

		};
	}
}
