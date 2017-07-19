import { Component, OnInit, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Facility, Prescription, PrescriptionItem, Dispense, Inventory, InventoryTransaction,
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
	selectedPrescription: PrescriptionItem = <PrescriptionItem>{};
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

		//this.storeId = '590b2070db527124e0697b18';

		this._route.params.subscribe(params => {
			this.prescriptionId = params['id'];
		});

		this.getPrescriptionDetails();
	}

	// Save prescription
	onClickSavePrescription() {
		console.log(this.prescriptionItems);
		// Populate each on of the billed product with the batches
		// available in the store seleted.
		//this._loadRespectiveBatches(this.prescriptionItems);

		this.prescriptions = this.prescriptionItems.prescriptionItems;
		this.prescriptionItems.prescriptionItems.forEach(element => {
			if(element.quantity !== undefined) {
				this.totalQuantity += element.quantity;
			}
			
			if(element.totalCost !== undefined) {
				this.totalCost += element.totalCost;
			}
		});
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
					if(element.isBilled) {
						if(element.quantity !== undefined) {
							this.totalQuantity += element.quantity;
						}

						if(element.totalCost !== undefined) {
							this.totalCost += element.totalCost;
						}
						this.prescriptions.push(element);
					}
					element.transactions = [];
				});
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
				this._facilityService.announceNotification({
					type: 'Info',
					text: 'Please check into store!'
				});
			}
		} else {
			this._facilityService.announceNotification({
				type: 'Info',
				text: 'This item is marked external, you can not bill the patient!'
			});
		}
	}

	onClickBillProduct(parentIndex, index, batch, inputBatch) {
		// Check if the qty entered is less than or equal to the qty needed.
		if(inputBatch[index] <= this.prescriptionItems.prescriptionItems[parentIndex].quantity) {
			this.transactions.transactions.forEach(element => {	
				if(element._id === batch._id) {
					element.quantity = element.quantity - inputBatch[index];
				}
			});
			this.transactions.totalQuantity = this.transactions.totalQuantity - inputBatch[index];
			console.log(this.transactions);
			//const productId = this.prescriptionItems.prescriptionItems[parentIndex].productId;
			//const productId = '592419145fbce732205cf0ba';
			// Make a call to the inventory service so that you can deduct the quantity from the inventory
			if(this.storeId.typeObject.storeId !== undefined) {
				this._inventoryService.patch(this.transactions._id, this.transactions, {})
					.then(res => {
						console.log(res);
						
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				this._facilityService.announceNotification({
					type: 'Info',
					text: 'Please check into store!'
				});
			}
		} else {
			this._facilityService.announceNotification({
				type: 'Info',
				text: 'The quantity entered is greater than the quantity requested!'
			});
		}
		
	}

	// Send bill to billing service to bill the patient
	onClickBillPatient() {
		console.log(this.prescriptionItems);
		const billItemArray = []
		this.prescriptionItems.prescriptionItems.forEach(element => {
			const billItem = <BillItem> {
				facilityServiceId: element.facilityServiceId,
				serviceId: element.serviceId,
				facilityId: this.facility._id,
				patientId: this.prescriptionItems.patientId,
				quantity: element.quantity,
				totalPrice: element.totalCost,
				unitPrice: element.cost,
				unitDiscountedAmount: 0,
  				totalDiscoutedAmount: 0,
			};

			billItemArray.push(billItem);
		});

		const bill = <BillIGroup> {
			facilityId: this.facility._id,
			patientId: this.prescriptionItems.patientId,
			billItems: billItemArray,
			discount: 0,
			subTotal: this.totalCost,
			grandTotal: this.totalCost,
		}
		this._billingService.create(bill)
			.then(res => {
				console.log(res);
			})
			.catch(err => {
				console.log(err);
			});
	}

	//Load all the dispenses with their respective batches
	// private _loadRespectiveBatches(data) {
	// 	data.prescriptionItems.forEach(element => {
	// 		if (element.isBilled) {
	// 			// this.totalCostOnPre += element.totalCost;
	// 			// this.totalQtyOnPre += element.quantity;
	// 			this.prescriptions.push(element);
	// 		}
	// 	});
	// }

	billToggle() {
		this.billshow = !this.billshow;
	}
}
