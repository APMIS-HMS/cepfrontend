import { Component, OnInit, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, Prescription, PrescriptionItem, Dispense, 
	DispenseByPrescription, DispenseByNoprescription, DispenseItem } from '../../../../../models/index';
import { Clients } from '../../../../../shared-module/helpers/global-config';
import { PharmacyEmitterService } from '../../../../../services/facility-manager/pharmacy-emitter.service';
import { FacilitiesService, PrescriptionService, DispenseService} from '../../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-prescription',
	templateUrl: './prescription.component.html',
	styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent implements OnInit {
	@Output() prescriptionItems: Prescription = <Prescription>{};
	facility: Facility = <Facility>{};
	billshow: boolean = false;
	prescriptionId: string = '';
	prescriptions: any[] = [];
	storeId: string = '';
	totalQuantity: number = 0;
	totalCost: number = 0;
	loading: boolean = true;

	constructor(
		private _route: ActivatedRoute,
		private _locker: CoolLocalStorage,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		private _prescriptionService: PrescriptionService,
		private _dispenseService: DispenseService
	) {

	}

	ngOnInit() {
		this._pharmacyEventEmitter.setRouteUrl('Prescription Details');
		this.facility = <Facility> this._locker.getObject('selectedFacility');

		this.storeId = '';

		this._route.params.subscribe(params => {
			this.prescriptionId = params['id'];
		});

		this.getPrescriptionDetails();
	}

	// Save prescription
	onClickSavePrescription() {
		console.log(this.prescriptionItems);
		this.prescriptions = this.prescriptionItems.prescriptionItems;
	}

	// Dispense prescription
	onClickDispense() {
		console.log(this.prescriptionItems);
		let dispenseArray = [];
		this.prescriptionItems.prescriptionItems.forEach(element => {
			let dispenseItem = <DispenseItem> {
				productId: (element.isExternal === false) ? element.productId : '',
				cost: element.cost,
				quantity: (element.quantity === undefined) ? 0 : element.quantity,
				refillCount: (element.refillCount === undefined) ? 0 : element.refillCount,
				isExternal: element.isExternal,
				instruction: element.patientInstruction
			};

			if(!element.isExternal) {
				this.totalQuantity += element.quantity;
				this.totalCost += element.cost;
			}
			// Push all dispenseItem into dispenseArray
			dispenseArray.push(dispenseItem);
		});

		let prescription = <DispenseByPrescription> {
			prescriptionId: this.prescriptionItems._id,
			employeeId: this.prescriptionItems.employeeId,
			patientId: this.prescriptionItems.patientId,
			drugs: dispenseArray,
			totalQuantity: this.totalQuantity,
			totalCost: this.totalCost
		};
		let dispense = <Dispense> {
			facilityId: this.facility._id,
			prescription: prescription,
			storeId: this.storeId,
		}
		console.log(dispense);
		// this._dispenseService.create(this.prescriptionItems)
		// 	.then(res => {
		// 		console.log(res);
		//      this.route.navigate('/dashboard/pharmacy/prescriptions');
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	});
	}

	// Get all drugs from generic
	getPrescriptionDetails() {
		this._prescriptionService.get(this.prescriptionId, {})
			.then(res => {
				console.log(res);
				this.loading = false;
				this.prescriptionItems = res;
				res.prescriptionItems.forEach(element => {
					if(element.isBilled) {
						this.prescriptions.push(element);
					}
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	billToggle() {
		this.billshow = !this.billshow;
	}
}
