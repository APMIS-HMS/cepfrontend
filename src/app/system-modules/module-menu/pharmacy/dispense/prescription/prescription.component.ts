import { Component, OnInit, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Facility, Prescription, PrescriptionItem, Dispense, Inventory, InventoryTransaction, User,
	DispenseByPrescription, DispenseByNoprescription, DispenseItem, MedicationList, BillIGroup, BillItem } from '../../../../../models/index';
import { Clients } from '../../../../../shared-module/helpers/global-config';
import { PharmacyEmitterService } from '../../../../../services/facility-manager/pharmacy-emitter.service';
import { FacilitiesService, PrescriptionService,
	DispenseService, MedicationListService, InventoryService, BillingService} from '../../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-prescription',
	templateUrl: './prescription.component.html',
	styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent implements OnInit {
	@Output() prescriptionItems: Prescription = <Prescription>{};
	@Input() employeeDetails: any;
	//dispenseForm: FormGroup;
	facility: Facility = <Facility>{};
	user: any = <any>{};
	selectedPrescription: PrescriptionItem = <PrescriptionItem>{};
	unBilledArray: PrescriptionItem[] = [];
	billshow = false;
	prescriptionId = '';
	prescriptions: any[] = [];
	transactions: Inventory = <Inventory>{};
	viewTransactions: InventoryTransaction[] = [];
	storeId: any = {};
	//totalCostOnPre = 0;
	totalQuantity = 0;
	//totalQtyOnPre = 0;
	totalCost = 0;
	loading = true;
	batchLoading = true;

	constructor(
		//private _fb: FormBuilder,
		private _route: ActivatedRoute,
		private _router: Router,
		private _locker: CoolSessionStorage,
		private _facilityService: FacilitiesService,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		private _prescriptionService: PrescriptionService,
		private _dispenseService: DispenseService,
		private _inventoryService: InventoryService,
		//private _medicationListService: MedicationListService,
		private _billingService: BillingService
	) {

	}

	ngOnInit() {
		this._pharmacyEventEmitter.setRouteUrl('Prescription Details');
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.storeId = this._locker.getObject('checkingObject');
		this.user = this._locker.getObject('auth');

		this._route.params.subscribe(params => {
			this.prescriptionId = params['id'];
		});

		this.getPrescriptionDetails();
	}

	// Save prescription
	onClickSavePrescription() {
		console.log(this.prescriptionItems);
		console.log(this.unBilledArray);
		const tempArray = [];
		// Get the billed items from the unbilled items
		this.unBilledArray.forEach((element, i) => {
			// Billed items
			if(element.isBilled) {
				tempArray.push(element);
			}
		});

		if(tempArray.length > 0) {
			// this has been billed before.
			if(this.prescriptionItems.billId !== undefined) {
				// Call the billing service
				this._billingService.get(this.prescriptionItems.billId, {})
					.then(res => {
						console.log(res);
						let totalCost = 0;
						let totalQuantity = 0;
						
						this.unBilledArray.forEach(element => {
							if(element.isBilled) {
								const billItem = <BillItem> {
									facilityServiceId: element.facilityServiceId,
									serviceId: element.serviceId,
									facilityId: res.facilityId,
									patientId: res.patientId,
									description: element.productName,
									quantity: element.quantity,
									totalPrice: element.totalCost,
									unitPrice: element.cost,
									unitDiscountedAmount: 0,
									totalDiscoutedAmount: 0,
								};

								totalCost += element.totalCost;
								totalQuantity += element.quantity;
								this.totalQuantity += element.quantity;
								this.totalCost += element.totalCost;

								res.billItems.push(billItem);
							}
						});

						// Update the subTotal and grandTotal in the billing response.
						res.subTotal += totalCost;
						res.grandTotal += totalCost;
						// Update the totalCost and totalQuantity in the prescriptionItems object.
						this.prescriptionItems.totalCost = this.totalCost;
						this.prescriptionItems.totalQuantity = this.totalQuantity;
						console.log(res);
						// Update the Billing service
						this._billingService.update(res)
							.then(res => {
								console.log(res);
								console.log(this.prescriptionItems);
								if(res._id !== undefined) {
									this._prescriptionService.update(this.prescriptionItems)
										.then(res => {
											console.log(res);
											if(res._id !== undefined) {
												this.unBilledArray.forEach((element, i) => {
													if(element.isBilled) {
														// Remove items that has been billed
														this.unBilledArray.splice(i, 1);
														// Push the element to the view
														this.prescriptions.push(element);
													}
												});
											}
										})
										.catch(err => { console.log(err); });
								}
							})
							.catch(err => { console.log(err); });
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				// There has never been any bill
				const billItemArray = [];
				let totalCost = 0;
				let totalQuantity = 0;
				
				this.unBilledArray.forEach(element => {
					if(element.isBilled) {
						const billItem = <BillItem> {
							facilityServiceId: element.facilityServiceId,
							serviceId: element.serviceId,
							facilityId: this.prescriptionItems.facilityId,
							patientId: this.prescriptionItems.patientId,
							description: element.productName,
							quantity: element.quantity,
							totalPrice: element.totalCost,
							unitPrice: element.cost,
							unitDiscountedAmount: 0,
							totalDiscoutedAmount: 0,
						};

						totalCost += element.totalCost;
						totalQuantity += element.quantity;
						this.totalQuantity += element.quantity;
						this.totalCost += element.totalCost;

						billItemArray.push(billItem);
					}
				});

				const bill = <BillIGroup> {
					facilityId: this.facility._id,
					patientId: this.prescriptionItems.patientId,
					billItems: billItemArray,
					discount: 0,
					subTotal: totalCost,
					grandTotal: totalCost,
				}
				console.log(bill);
				// send the billed items to the billing service
				this._billingService.create(bill)
					.then(res => {
						console.log(res);
						if(res._id !== undefined) {
							// Update the totalCost and totalQuantity in the prescriptionItems object.
							this.prescriptionItems.totalCost = this.totalCost;
							this.prescriptionItems.totalQuantity = this.totalQuantity;
							this.prescriptionItems.billId = res._id
							this._prescriptionService.update(this.prescriptionItems)
								.then(res => {
									console.log(res);
									if(res._id !== undefined) {
										this.unBilledArray.forEach((element, i) => {
											if(element.isBilled) {
												// Remove items that has been billed
												this.unBilledArray.splice(i, 1);
												// Push the element to the view
												this.prescriptions.push(element);
											}
										});
									}
								})
								.catch(err => { console.log(err); });
						}
					})
					.catch(err => { console.log(err); });
			}
		} else {
			this._notification('Info', 'Please bill the prescribed drugs above.');
		}
	}

	// Dispense prescription
	onClickDispense() {
		const dispenseArray = [];
		this.prescriptionItems.prescriptionItems.forEach(element => {
			const dispenseItem = <DispenseItem> {
				productId: (element.isExternal === false) ? element.productId : '',
				cost: element.cost,
				quantity: (element.quantity === undefined) ? 0 : element.quantity,
				refillCount: (element.refillCount === undefined) ? 0 : element.refillCount,
				isExternal: element.isExternal,
				instruction: element.patientInstruction
			};

			if (!element.isExternal) {
				if(element.quantity !== undefined) {
					this.totalQuantity += element.quantity;
				}

				if(element.totalCost !== undefined) {
					this.totalCost += element.totalCost;
				}
			}
			// Push all dispenseItem into dispenseArray
			dispenseArray.push(dispenseItem);
		});

		const prescription = <DispenseByPrescription> {
			prescriptionId: this.prescriptionItems._id,
			employeeId: this.prescriptionItems.employeeId,
			patientId: this.prescriptionItems.patientId,
			drugs: dispenseArray,
			totalQuantity: this.totalQuantity,
			totalCost: this.totalCost
		};
		const dispense = <Dispense> {
			facilityId: this.facility._id,
			prescription: prescription,
			isPrescription: true,
			storeId: this.storeId,
		}
		console.log(dispense);
		this._dispenseService.create(dispense)
			.then(res => {
				console.log(res);
				if(res) {
					let medication = <MedicationList>{
						facilityId: this.facility._id,
						dispenseById: res.prescription.employeeId,
						dispenseId: res._id,
						storeId: this.storeId,
						prescriptionId: res.prescription.prescriptionId,
						statusId: res.statusId,
						patientId: res.prescription.patientId,
						medicationEndDate: res.createdAt
					};

					// this._medicationListService.create(medication)
					// 	.then(res => {
					// 		console.log(res);
					// 		this.prescriptionItems.isDispensed = true;
					// 		this._prescriptionService.update(this.prescriptionItems)
					// 			.then(res => {
					// 				console.log(res);
					// 				this._facilityService.announceNotification({
					//					users: [this.user._id],
					// 					type: 'Success',
					// 					text: 'Prescription has been Dispensed!'
					// 				});
					// 				setTimeout( e => {
					// 					this._router.navigate(['/dashboard/pharmacy/prescriptions']);
					// 				}, 1000);
					// 			})
					// 			.catch(err => {
					// 				console.log(err);
					// 			});
					// 	})
					// 	.catch(err => {
					// 		console.log(err);
					// 	});
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	// Get all drugs from generic
	getPrescriptionDetails() {
		this._prescriptionService.get(this.prescriptionId, {})
			.then(res => {
				console.log(res);
				this.loading = false;
				this.prescriptionItems = res;

				// Reset all the prescriptionItem.transactions to an empty array.
				this.prescriptionItems.prescriptionItems.forEach(element => {
					// Billed items
					if(element.isBilled) {
						if(element.quantity !== undefined) {
							this.totalQuantity += element.quantity;
						}

						if(element.totalCost !== undefined) {
							this.totalCost += element.totalCost;
						}
						// Add the payment status on the fly
						element.paymentCompleted = false;
						this.prescriptions.push(element);
					}

					// Unbilled items
					if(!element.isBilled) {
						this.unBilledArray.push(element);
					}
					element.transactions = [];
				});

				if(this.prescriptions.length > 0) {
					if(this.prescriptionItems.billId !== undefined) {
						this._billingService.get(this.prescriptionItems.billId, {})
							.then(res => {
								if(res._id !== undefined) {
									res.billItems.forEach(i => {
										this.prescriptions.forEach(j => {
											if(i.serviceId === j.serviceId) {
												j.paymentCompleted = i.paymentCompleted;
											}
										});
									});
								}
							})
							.catch(err => { console.log(err); });
					}
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	onClickEachPrescription(index, prescription) {
		console.log(index);
		console.log(prescription);
		if(prescription.isBilled) {
			this.selectedPrescription = prescription;
			this.selectedPrescription.isOpen = !this.selectedPrescription.isOpen;
			//const productId = prescription.productId;
			const productId = '592419145fbce732205cf0ba';
			if(this.storeId.typeObject.storeId !== undefined) {
				// Get the batches for the selected product
				this._inventoryService.find({ 
					query: { 
						facilityId: this.facility._id, 
						productId: productId, 
						storeId: this.storeId.typeObject.storeId 
					}})
					.then(res => {
						console.log(res);
						if(res.data.length > 0) {
							this.transactions = res.data[0];
							const tempArray = [];
							// Display only batches that have qty greater than 0.
							if(res.data[0].transactions.length !== 0) {
								res.data[0].transactions.forEach(element => {
									if(element.quantity > 0) {
										tempArray.push(element);
									}
								});
							}
							if(tempArray.length !== 0) {
								this.viewTransactions = tempArray;
							} else {
								this.viewTransactions = [];
							}
						}
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				this._notification('Info', 'Please check into store!');
			}
		} else {
			this._notification('Info', 'This item is marked external, you can not bill the patient!');
		}
	}

	onClickBillProduct(parentIndex, index, batch, inputBatch) {
		const item = this.prescriptionItems.prescriptionItems.filter(e => e._id === this.prescriptions[parentIndex]._id);
		const itemId = item[0]._id;
		// Check if the qty entered is less than or equal to the qty needed.
		if(inputBatch[index] <= item[0].quantity) {
			this.transactions.transactions.forEach(element => {	
				if(element._id === batch._id) {
					element.quantity = element.quantity - inputBatch[index];
				}
			});
			this.transactions.totalQuantity = this.transactions.totalQuantity - inputBatch[index];

			if(this.storeId.typeObject.storeId !== undefined) {
				// Update the quantityDispensed in the selected item.
				const itemIndex = this.prescriptionItems.prescriptionItems.findIndex(item => item._id == itemId);
				this.prescriptionItems.prescriptionItems[itemIndex].quantityDispensed = inputBatch[index];

				// Make a call to update the prescription with the qty dispensed
				this._prescriptionService.update(this.prescriptionItems)
					.then(res => {
						console.log(res);
						if(res._id !== undefined) {
							// Make a call to the inventory service so that you can deduct the quantity from the inventory
							this._inventoryService.patch(this.transactions._id, this.transactions, {})
								.then(res => {
									console.log(res);
									this._notification('Success', 'Quantity has been deducted.');
								})
								.catch(err => {
									console.log(err);
								});
						}
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				this._notification('Info', 'Please check into store!');
			}
		} else {
			this._notification('Info', 'The quantity entered is greater than the quantity requested!');
		}
		
	}

	// Send bill to billing service to bill the patient
	// onClickBillPatient() {
	// 	console.log(this.prescriptionItems);
	// 	const billItemArray = []
	// 	this.prescriptionItems.prescriptionItems.forEach(element => {
	// 		const billItem = <BillItem> {
	// 			facilityServiceId: element.facilityServiceId,
	// 			serviceId: element.serviceId,
	// 			facilityId: this.facility._id,
	// 			patientId: this.prescriptionItems.patientId,
	// 			quantity: element.quantity,
	// 			totalPrice: element.totalCost,
	// 			unitPrice: element.cost,
	// 			unitDiscountedAmount: 0,
  	// 			totalDiscoutedAmount: 0,
	// 		};

	// 		billItemArray.push(billItem);
	// 	});

	// 	const bill = <BillIGroup> {
	// 		facilityId: this.facility._id,
	// 		patientId: this.prescriptionItems.patientId,
	// 		billItems: billItemArray,
	// 		discount: 0,
	// 		subTotal: this.totalCost,
	// 		grandTotal: this.totalCost,
	// 	}
	// 	this._billingService.create(bill)
	// 		.then(res => {
	// 			console.log(res);
	// 		})
	// 		.catch(err => {
	// 			console.log(err);
	// 		});
	// }

	billToggle() {
		this.billshow = !this.billshow;
	}

	private _notification(type: string, text: string): void {
		this._facilityService.announceNotification({
			users: [this.user._id],
			type: type,
			text: text
		});
	}
}
