import { Component, OnInit, Output, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
	Facility, Prescription, PrescriptionItem, Dispense, Inventory, InventoryTransaction, User,
	Dispensed, DispensedArray, BatchTransaction,
	DispenseByPrescription, DispenseByNoprescription, DispenseItem, MedicationList, BillIGroup, BillItem
} from '../../../../../models/index';
import { Clients } from '../../../../../shared-module/helpers/global-config';
import { PharmacyEmitterService } from '../../../../../services/facility-manager/pharmacy-emitter.service';
import {
	FacilitiesService, PrescriptionService, InventoryTransactionTypeService, ExternalPrescriptionService,
	DispenseService, MedicationListService, InventoryService, BillingService, EmployeeService
} from '../../../../../services/facility-manager/setup/index';
import { ISubscription } from 'rxjs/Subscription';
import { SystemModuleService } from '../../../../../services/module-manager/setup/system-module.service';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';

@Component({
	selector: 'app-prescription',
	templateUrl: './prescription.component.html',
	styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent implements OnInit, OnDestroy {
	@Output() prescriptionItems: Prescription = <Prescription>{};
	@Output() isExternalPrescription = false;
	@Input() employeeDetails: any;
	facility: Facility = <Facility>{};
	user: User = <User>{};
	selectedPrescription: PrescriptionItem = <PrescriptionItem>{};
	unBilledArray: PrescriptionItem[] = [];
	billshow = false;
	prescriptionId = '';
	prescriptions: any[] = [];
	transactions: Inventory = <Inventory>{};
	viewTransactions: InventoryTransaction[] = [];
	storeId: any = {};
	totalQuantity = 0;
	totalCost = 0;
	loading = true;
	batchLoading = true;
	disableDispenseBtn = false;
	disableDispenseAllBtn = true;
	qtyDispenseBtn = true;
	qtyDispensingBtn = false;
	inventoryTransactionTypeId = '';
	disablePaymentBtn = false;
	disableSaveBtn = false;
	paymentStatusText = true;
	paymentStatusTexting = false;
	dispenseAllBtnText = true;
	dispensingAllBtnText = false;
	saveBtn = true;
	savingBtn = false;
	subscription: ISubscription;

	constructor(
		// private _fb: FormBuilder,
		private _route: ActivatedRoute,
		private _router: Router,
		private _locker: CoolLocalStorage,
		private _facilityService: FacilitiesService,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		private _prescriptionService: PrescriptionService,
		private _dispenseService: DispenseService,
		private _inventoryService: InventoryService,
		private _employeeService: EmployeeService,
		// private _medicationListService: MedicationListService,
		private _authFacadeService: AuthFacadeService,
		private _systemModuleService: SystemModuleService,
		private _billingService: BillingService,
		private _inventoryTransactionTypeService: InventoryTransactionTypeService,
		private _externalPrescriptionService: ExternalPrescriptionService
	) {
		const url: String = this._router.url;
		// let url = window.location.href;
		if (url.includes('pharmacy/external-prescriptions')) {
			this.isExternalPrescription = true;
		} else {
			this.isExternalPrescription = false;
		}

		this._authFacadeService.getLogingEmployee().then((res: any) => {
			this.employeeDetails = res;
			if (!!res.storeCheckIn && res.storeCheckIn.length > 0) {
				const store = res.storeCheckIn.filter(x => x.isOn);
				const storeObj = {
					type: 'store',
					typeObject: store[0]
				};
				this.storeId = storeObj;
			}
		}).catch(err => { });

		this.subscription = this._employeeService.checkInAnnounced$.subscribe(res => {
			if (!!res && !!res.typeObject) {
				this.storeId = res.typeObject.storeId;
			}
		});
	}

	ngOnInit() {
		this._pharmacyEventEmitter.setRouteUrl('Prescription Details');
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		// this.storeId = this._locker.getObject('checkingObject');
		// this.user = <User>this._locker.getObject('auth');

		this._route.params.subscribe(params => {
			this.prescriptionId = params['id'];
		});

		this._getPrescriptionDetails();
		this._getInventoryTransactionTypes();

		if (this.prescriptionItems.prescriptionItems !== undefined) {
			console.log(this.prescriptionItems);
			const notBilled = this.prescriptionItems.prescriptionItems
				.filter(x => ((x.quantity !== x.quantityDispensed || !x.paymentCompleted) && !x.paymentCompleted && !x.isExternal));

			if (notBilled.length > 0) {
				this.disableDispenseAllBtn = true;
			} else {
				this.disableDispenseAllBtn = false;
			}
		}
	}

	// Save prescription
	onClickSavePrescription() {
		const tempArray = [];
		// Get the billed items from the unbilled items
		this.unBilledArray.forEach((element, i) => {
			// Billed items
			if (element.isBilled || element.isExternal) {
				tempArray.push(element);
			}
		});

		if (tempArray.length > 0) {
			this.disableSaveBtn = true;
			this.saveBtn = false;
			this.savingBtn = true;

			if (!this.isExternalPrescription) {
				this._isPrescriptionLogic();
			} else {
				this._isExternalPrescriptonLogic();
			}
		} else {
			this._systemModuleService.announceSweetProxy('Please bill the prescribed drugs above.', 'error');
		}
	}

	// Dispense prescription
	onClickDispense() {
		if (this.prescriptions.length > 0) {
			this.disableDispenseAllBtn = true;
			this.dispenseAllBtnText = false;
			this.dispensingAllBtnText = true;
			const dispenseArray = [];
			const externalDrug = [];

			this.prescriptionItems.prescriptionItems.forEach(element => {
				if (!element.isExternal && element.isBilled) {
					// Change the value of isDispensed to true;
					element.isDispensed = true;
					const dispenseItem = <DispenseItem>{
						productId: (element.isExternal === false) ? element.productId : '',
						cost: element.cost,
						quantity: (element.quantity === undefined) ? 0 : element.quantity,
						refillCount: (element.refillCount === undefined) ? 0 : element.refillCount,
						isExternal: element.isExternal,
						instruction: element.patientInstruction
					};

					// Push all dispenseItem into dispenseArray
					dispenseArray.push(dispenseItem);
				}
				// else if(element.isExternal) {
				// 	const external = {
				// 		genericName: element.genericName,
				// 	}

				// 	externalDrug.push(external);
				// }
			});

			// const externalDispense = {
			// 	prescriptionId: this.prescriptionId,
			// 	facilityId: this.prescriptionItems.facilityId,
			// 	patientId: this.prescriptionItems.patientId,
			// 	patientName: this.prescriptionItems.patientName,
			// 	generics: externalDrug,
			// 	prescribeById: this.prescriptionItems.employeeId,
			// }

			const prescription = <DispenseByPrescription>{
				prescriptionId: this.prescriptionItems._id,
				employeeId: this.prescriptionItems.employeeId,
				patientId: this.prescriptionItems.patientId,
				drugs: dispenseArray,
				totalQuantity: this.totalQuantity,
				totalCost: this.totalCost
			};
			const dispense = <Dispense>{
				facilityId: this.facility._id,
				prescription: prescription,
				isPrescription: true,
				storeId: this.storeId,
			}
			this._dispenseService.create(dispense).then(res => {
				this.prescriptionItems.isDispensed = true;
				// Call the prescription service to change the isDispensed to true.
				// tslint:disable-next-line:no-shadowed-variable
				this._prescriptionService.update(this.prescriptionItems).then(res => {
					this.disableDispenseAllBtn = true;
					this.dispenseAllBtnText = true;
					this.dispensingAllBtnText = false;
					this._systemModuleService.announceSweetProxy('Drugs has been dispensed successfully', 'success');

					setTimeout(e => {
						this._router.navigate(['/dashboard/pharmacy/prescriptions']);
					}, 2000);
				}).catch(err => console.error(err));
			}).catch(err => console.error(err));
			// if(externalDispense.generics.length > 0) {
			// 	// Save external Prescriptions.
			// 	this._externalPrescriptionService.create(externalDispense).then(res => {
			//
			// 	}).catch(err => console.error(err));
			// }
		} else {
			this._systemModuleService.announceSweetProxy('Please Bill the drugs that has been prescribed above.', 'error');
		}
	}

	// Get all drugs from generic
	private _getPrescriptionDetails() {
		this._prescriptionService.get(this.prescriptionId, {}).then(res => {
			console.log(res);
			this.loading = false;

			// Check if the page is for prescription or external prescription
			if (!this.isExternalPrescription) {
				this.prescriptionItems = res;

				const notBilled = this.prescriptionItems.prescriptionItems
					.filter(x => ((x.quantity !== x.quantityDispensed || !x.paymentCompleted) && !x.paymentCompleted && !x.isExternal));
				if (notBilled.length > 0) {
					this.disableDispenseAllBtn = true;
				} else {
					this.disableDispenseAllBtn = false;
				}

				if (this.prescriptionItems.isDispensed) {
					this.disableDispenseAllBtn = true;
					this.dispenseAllBtnText = true;
					this.dispensingAllBtnText = false;
				}

				// Reset all the prescriptionItem.transactions to an empty array.
				this.prescriptionItems.prescriptionItems.forEach(element => {
					// Billed items
					if (element.isBilled || element.isExternal) {
						if (element.quantity !== undefined && element.totalCost !== undefined) {
							this.totalQuantity += element.quantity;
							this.totalCost += element.totalCost;
						}

						if (element.isExternal) {
							element.quantity = 0;
							element.quantityDispensed = 0;
						}
						// Add the payment status on the fly
						element.paymentCompleted = false;
						this.prescriptions.push(element);
					}

					// Unbilled items
					if (!element.isBilled) {
						this.unBilledArray.push(element);
					}
					element.transactions = [];
				});

				if (this.prescriptions.length > 0) {
					this._getPaymentStatus();
				}
			} else {
				// Filter the external prescriptions only
				const external = res.prescriptionItems
				.filter(x => !x.isDispensed && (!!x.facilityId && x.isBilled && (x.facilityId === this.facility._id)) || x.isExternal);
				res.prescriptionItems = external;
				this.prescriptionItems = res;

				// Reset all the prescriptionItem.transactions to an empty array.
				this.prescriptionItems.prescriptionItems.forEach(element => {
					// Billed items
					if (element.isBilled || element.isExternal) {
						if (element.quantity !== undefined && element.totalCost !== undefined) {
							this.totalQuantity += element.quantity;
							this.totalCost += element.totalCost;
						}

						if (element.isExternal) {
							element.quantity = 0;
							element.quantityDispensed = 0;
						}
						// Add the payment status on the fly
						element.paymentCompleted = false;
						this.prescriptions.push(element);
					}

					// Unbilled items
					if (!element.isBilled) {
						this.unBilledArray.push(element);
					}
					element.transactions = [];
				});
			}
		}).catch(err => console.error(err));
	}

	onClickEachPrescription(index, prescription) {
		if (prescription.isBilled) {
			if (prescription.paymentCompleted) {
				this.selectedPrescription = prescription;
				this.selectedPrescription.isOpen = !this.selectedPrescription.isOpen;
				const productId = prescription.productId;
				// const productId = '592419145fbce732205cf0ba';
				if (this.storeId.typeObject.storeId !== undefined) {
					// Get the batches for the selected product
					this._inventoryService.find({
						query: {
							facilityId: this.facility._id,
							productId: productId,
							storeId: this.storeId.typeObject.storeId
						}
					})
						.then(res => {
							this.batchLoading = false;
							if (res.data.length > 0) {
								this.transactions = res.data[0];
								const tempArray = [];
								// Display only batches that have qty greater than 0.
								if (res.data[0].transactions.length !== 0) {
									res.data[0].transactions.forEach(element => {
										if (element.quantity > 0) {
											tempArray.push(element);
										}
									});
								}
								if (tempArray.length !== 0) {
									this.viewTransactions = tempArray;
								} else {
									this.viewTransactions = [];
								}
							} else {
								this.viewTransactions = [];
							}
						}).catch(err => console.error(err));
				} else {
					this._systemModuleService.announceSweetProxy('Please check into store!', 'error');
				}
			} else {
				this._systemModuleService.announceSweetProxy('Patient has not paid for this item, so you can not dispense it!', 'error');
			}
		} else {
			this._systemModuleService.announceSweetProxy('This item is marked external, you can not bill the patient!', 'error');
		}
	}

	onClickBillProduct(parentIndex, index, batch, inputBatch) {
		const item = this.prescriptionItems.prescriptionItems.filter(e => e._id === this.prescriptions[parentIndex]._id);
		const itemId = item[0]._id;
		// Input validation
		if (inputBatch[index] <= 0 || inputBatch[index] === '' || isNaN(inputBatch[index])) {
			this._systemModuleService.announceSweetProxy('Please enter a valid number greater than 0.', 'error');
		} else {
			// Check if the qty entered is less than or equal to the qty needed.
			if (inputBatch[index] <= item[0].quantity) {
				// Check if the qty entered plus the quantity dispensed already,
				// if it's less than or equal to the qty needed to dispense.
				const qtyPlusQtyToDispense = item[0].quantityDispensed + inputBatch[index];
				if ((item[0].quantity - qtyPlusQtyToDispense) >= 0) {
					if (this.storeId.typeObject.storeId !== undefined) {
						// disable the dispense button.
						this.disableDispenseBtn = true;
						this.qtyDispenseBtn = false;
						this.qtyDispensingBtn = true;
						// Update the quantityDispensed in the selected item.
						// tslint:disable-next-line:no-shadowed-variable
						const itemIndex = this.prescriptionItems.prescriptionItems.findIndex(item => item._id === itemId);
						this.prescriptionItems.prescriptionItems[itemIndex].quantityDispensed += inputBatch[index];
						// Build the dispense client model
						this._dispensedBatchTracking(itemIndex, inputBatch[index], batch.batchNumber);

						// Make a call to update the prescription with the qty dispensed
						this._prescriptionService.update(this.prescriptionItems).then(res => {
							if (res._id !== undefined) {
								this._batchTransactionTracking(index, inputBatch[index], batch);
								// Make a call to the inventory service so that you can deduct the quantity from the inventory
								this._inventoryService.patch(this.transactions._id, this.transactions, {})
									// tslint:disable-next-line:no-shadowed-variable
									.then(res => {
										// disable the dispense button.
										this.disableDispenseBtn = false;
										this.qtyDispenseBtn = true;
										this.qtyDispensingBtn = false;
										this._systemModuleService.announceSweetProxy('Quantity has been deducted.', 'success');
									})
									.catch(err => {
									});
							}
						}).catch(err => console.error(err));
					} else {
						this._systemModuleService.announceSweetProxy('Please check into store!', 'error');
					}
				} else {
					this._systemModuleService.announceSweetProxy('The quantity entered is greater than the quantity requested!', 'error');
				}
			} else {
				this._systemModuleService.announceSweetProxy('The quantity entered is greater than the quantity requested!', 'error');
			}
		}
	}

	billToggle() {
		this.billshow = !this.billshow;
	}

	onClickRefreshPaymentStatus() {
		this._getPaymentStatus();
	}

	// Dispense resolver
	private _dispensedBatchTracking(index: number, qty: number, bNumber: string): void {
		const dispensedKey = this.prescriptionItems.prescriptionItems[index];
		let orderIndex = 0;

		if (dispensedKey.dispensed.dispensedArray === undefined) {
			orderIndex = orderIndex;
		} else {
			orderIndex = dispensedKey.dispensed.dispensedArray.length;
		}

		dispensedKey.dispensed.totalQtyDispensed = dispensedKey.quantityDispensed;
		dispensedKey.dispensed.outstandingBalance = dispensedKey.quantity - dispensedKey.quantityDispensed;

		const item: DispensedArray = {
			orderIndex: orderIndex, // unique
			dispensedDate: new Date,
			batchNumber: bNumber,
			qty: qty,
			employeeName: this.prescriptionItems.employeeName,
			storeName: this.storeId.typeObject.storeObject.name,
			unitBilledPrice: dispensedKey.cost,
			totalAmount: dispensedKey.cost * qty
		};

		dispensedKey.dispensed.dispensedArray.push(item);
	}

	private _batchTransactionTracking(index: number, qty: number, batch: any) {
		// Deduct from the batches before updating the batches in the inventory.
		this.transactions.transactions.forEach(element => {
			if (element._id === batch._id) {
				const batchTransaction: BatchTransaction = {
					batchNumber: <string>batch.batchNumber,
					employeeId: <string>this.prescriptionItems.employeeId,
					employeeName: <string>this.prescriptionItems.employeeName,
					preQuantity: <number>batch.quantity, // Before Operation.
					postQuantity: <number>batch.quantity - qty, // After Operation.
					quantity: <number>qty, // Operational qty.
					referenceId: <string>this.prescriptionItems._id, // Dispense id, Transfer id...
					referenceService: 'Prescription/Dispense Service', // Dispense, Transfer...
					inventorytransactionTypeId: <string>this.inventoryTransactionTypeId,
				}
				element.batchTransactions.push(batchTransaction);
				element.quantity = element.quantity - qty;
			}
		});
		this.transactions.totalQuantity = this.transactions.totalQuantity - qty;
	}

	// Get payment status
	private _getPaymentStatus() {
		this.disablePaymentBtn = true;
		this.paymentStatusText = false;
		this.paymentStatusTexting = true;
		if (this.prescriptionItems.billId !== undefined) {
			this._billingService.get(this.prescriptionItems.billId, {}).then(res => {
				console.log(res);
				if (res._id !== undefined) {
					this.disablePaymentBtn = false;
					this.paymentStatusText = true;
					this.paymentStatusTexting = false;
					res.billItems.forEach(i => {
						this.prescriptions.forEach(j => {
							console.log(j);
							if (i.serviceId === j.serviceId) {
								j.paymentCompleted = i.paymentCompleted;
							}
						});
					});

					setTimeout(e => {
						const condition = this.prescriptionItems.prescriptionItems.length !== this.prescriptions.length;
						const notBilled = this.prescriptions
						.filter(x => ((x.quantity !== x.quantityDispensed || !x.paymentCompleted) && !x.paymentCompleted && !x.isExternal));
						if (notBilled.length > 0 || condition) {
							this.disableDispenseAllBtn = true;
						} else {
							this.disableDispenseAllBtn = false;
						}
					}, 5000);
				}
			}).catch(err => console.error(err));
		} else {
			this.disablePaymentBtn = true;
			this.paymentStatusText = true;
			this.paymentStatusTexting = false;
		}
	}

	// Notification
	// private _notification(type: string, text: string): void {
	// 	this._facilityService.announceNotification({
	// 		users: [this.user._id],
	// 		type: type,
	// 		text: text
	// 	});
	// }

	// Get all the inventory transaction types.
	private _getInventoryTransactionTypes() {
		this._inventoryTransactionTypeService.findAll().then(res => {
			if (res.data.length > 0) {
				const inventoryType = res.data.filter(x => x.name.toLowerCase().includes('dispense'));
				this.inventoryTransactionTypeId = inventoryType[0]._id;
			}
		}).catch(err => console.log(err));
	}

	// Prescription logic.
	private _isPrescriptionLogic() {
		// this has been billed before.
		console.log(this.prescriptionItems);
		console.log(this.unBilledArray);
		// if (!!this.prescriptionItems.billId && this.prescriptionItems.hasOwnProperty('billId')) {
			// check if there is any item that needs to be billed.
			const containsIsBilled = this.unBilledArray.filter(x => x.isBilled);
			if (containsIsBilled.length > 0) {
				this._generateBill();
				// const payload = {
				// 	_id: this.prescriptionItems._id,
				// 	facilityId: this.facility._id,
				// 	billId: this.prescriptionItems.billId,
				// 	prescription: this.prescriptionItems,
				// 	unBilledArray: this.unBilledArray
				// };

				// this._prescriptionService.billUpdate(payload).then(res => {
				// 	console.log(res);
				// 	if (res.status === 'success') {
				// 		// Update the view
				// 		// this.unBilledArray.forEach(element => {
				// 		// 	console.log(element);
				// 		// 	if (element.isBilled) {
				// 		// 		this.totalQuantity += element.quantity;
				// 		// 		this.totalCost += element.totalCost;
				// 		// 	}
				// 		// });

				// 		// Update the totalCost and totalQuantity in the prescriptionItems object.
				// 		// this.prescriptionItems.totalCost = this.totalCost;
				// 		// this.prescriptionItems.totalQuantity = this.totalQuantity;
				// 		this.disableSaveBtn = false;
				// 		this.saveBtn = true;
				// 		this.savingBtn = false;
				// 		// clear prescriptions then call the getPrescriptionsDetails again.
				// 		this.prescriptions = [];
				// 		this.totalCost = 0;
				// 		this.totalQuantity = 0;
				// 		this.unBilledArray = [];
				// 		this._getPrescriptionDetails();
				// 	}
				// }).catch(e => console.log(e));
			} else {
				// Reset back the button.
				this.disableSaveBtn = false;
				this.saveBtn = true;
				this.savingBtn = false;
			}
			// Call the billing service
			// this._billingService.find({ query: { _id: this.prescriptionItems.billId, facilityId: this.facility._id } }).then(res => {
			// 	console.log(res);
			// 		// Check if the initial generated billingId exist with this facility
			// 	if (res.data.length > 0) {
			// 		const containsIsBilled = this.unBilledArray.filter(x => x.isBilled);
			// 		let totalCost = 0;
			// 		let totalQuantity = 0;
			// 		if (containsIsBilled.length > 0) {
			// 			this.unBilledArray.forEach(element => {
			// 				console.log(element);
			// 				if (element.isBilled) {
			// 					const billItem = <BillItem>{
			// 						facilityServiceId: element.facilityServiceId,
			// 						serviceId: element.serviceId,
			// 						facilityId: res.data[0].facilityId,
			// 						patientId: res.data[0].patientId,
			// 						description: element.genericName,
			// 						quantity: element.quantity,
			// 						totalPrice: element.totalCost,
			// 						unitPrice: element.cost,
			// 						unitDiscountedAmount: 0,
			// 						totalDiscoutedAmount: 0,
			// 					};

			// 					totalCost += element.totalCost;
			// 					totalQuantity += element.quantity;
			// 					this.totalQuantity += element.quantity;
			// 					this.totalCost += element.totalCost;

			// 					res.data[0].billItems.push(billItem);
			// 				}
			// 			});

			// 			// Update the subTotal and grandTotal in the billing response.
			// 			res.subTotal += totalCost;
			// 			res.grandTotal += totalCost;
			// 			// Update the totalCost and totalQuantity in the prescriptionItems object.
			// 			this.prescriptionItems.totalCost = this.totalCost;
			// 			this.prescriptionItems.totalQuantity = this.totalQuantity;
			// 			// Update the Billing service
			// 			this._billingService.patch(res.data[0]._id, res.data[0], {}).then(res1 => {
			// 				if (res1._id !== undefined) {
			// 					this._prescriptionService.update(this.prescriptionItems).then(res2 => {
			// 						if (res2._id !== undefined) {
			// 							this.disableSaveBtn = false;
			// 							this.saveBtn = true;
			// 							this.savingBtn = false;
			// 							// clear prescriptions then call the getPrescriptionsDetails again.
			// 							this.prescriptions = [];
			// 							this.totalCost = 0;
			// 							this.totalQuantity = 0;
			// 							this._getPrescriptionDetails();
			// 						}
			// 					}).catch(err => console.error(err));
			// 				}
			// 			}).catch(err => { console.log(err); });
			// 		} else {
			// 			// Reset back the button.
			// 			this.disableSaveBtn = false;
			// 			this.saveBtn = true;
			// 			this.savingBtn = false;
			// 		}
			// 	} else {
			// 		// This is a new facility that is trying to bill a drug
			// 		this._generateBill();
			// 	}
			// }).catch(err => console.error(err));
		// } else {
		// 	// There has never been any bill
		// 	this._generateBill();
		// }
	}

	// External Prescription logic.
	private _isExternalPrescriptonLogic() {
		this._isPrescriptionLogic();
	}

	private _generateBill() {
		const billItemArray = [];
		// let totalCost = 0;
		// let totalQuantity = 0;

		this.unBilledArray.forEach(element => {
			if (element.isBilled) {
				const billItem = <BillItem>{
					facilityServiceId: element.facilityServiceId,
					serviceId: element.serviceId,
					facilityId: this.prescriptionItems.facilityId,
					patientId: this.prescriptionItems.patientId,
					description: element.genericName,
					quantity: element.quantity,
					totalPrice: element.totalCost,
					unitPrice: element.cost,
					unitDiscountedAmount: 0,
					totalDiscoutedAmount: 0,
				};

				// totalCost += element.totalCost;
				// totalQuantity += element.quantity;
				this.totalQuantity += element.quantity;
				this.totalCost += element.totalCost;

				billItemArray.push(billItem);
			}
		});
		if (billItemArray.length > 0) {
			// const bill = <BillIGroup>{
			// 	facilityId: this.facility._id,
			// 	patientId: this.prescriptionItems.patientId,
			// 	billItems: billItemArray,
			// 	discount: 0,
			// 	subTotal: totalCost,
			// 	grandTotal: totalCost,
			// 	totalQuantity: totalQuantity
			// }

			const payload = {
				facilityId: this.facility._id,
				billItems: billItemArray,
				prescription: this.prescriptionItems
			};

			this._prescriptionService.billCreate(payload).then(res => {
				if (res.status === 'success') {
					this.disableSaveBtn = false;
					this.saveBtn = true;
					this.savingBtn = false;
					// clear prescriptions then call the getPrescriptionsDetails again.
					this.prescriptions = [];
					this.totalCost = 0;
					this.totalQuantity = 0;
					this.unBilledArray = [];
					this._getPrescriptionDetails();
				}
			}).catch(e => console.log(e));

			// send the billed items to the billing service
			// this._billingService.create(bill).then(res => {
			// 	if (res._id !== undefined) {
			// 		// Update the totalCost and totalQuantity in the prescriptionItems object.
			// 		this.prescriptionItems.totalCost = this.totalCost;
			// 		this.prescriptionItems.totalQuantity = this.totalQuantity;
			// 		this.prescriptionItems.billId = res._id
			// 		this._prescriptionService.update(this.prescriptionItems).then(res1 => {
			// 			if (res1._id !== undefined) {
			// 				this.disableSaveBtn = false;
			// 				this.saveBtn = true;
			// 				this.savingBtn = false;
			// 				// clear prescriptions then call the getPrescriptionsDetails again.
			// 				this.prescriptions = [];
			// 				this.totalCost = 0;
			// 				this.totalQuantity = 0;
			// 				this._getPrescriptionDetails();
			// 			}
			// 		}).catch(err => { console.log(err); });
			// 	}
			// }).catch(err => { console.log(err); });
		} else {
			this.disableSaveBtn = false;
			this.saveBtn = true;
			this.savingBtn = false;
			this._systemModuleService.announceSweetProxy('If you do not have any of these drugs, Please check each item as external.', 'error');
		}
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

}
