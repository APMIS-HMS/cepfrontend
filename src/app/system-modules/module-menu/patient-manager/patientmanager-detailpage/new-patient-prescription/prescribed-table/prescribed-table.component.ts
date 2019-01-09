import { DrugListApiService } from './../../../../../../services/facility-manager/setup/drug-list-api.service';
import { DrugInteractionService } from './../services/drug-interaction.service';
import { Component, OnInit, Output, Input, OnDestroy } from '@angular/core';
import { Prescription, PrescriptionItem } from 'app/models';
import { Subscription } from 'rxjs';
import { PrescriptionPriorityService } from 'app/services/facility-manager/setup';

@Component({
	selector: 'app-prescribed-table',
	templateUrl: './prescribed-table.component.html',
	styleUrls: [ './prescribed-table.component.scss' ]
})
export class PrescribedTableComponent implements OnInit, OnDestroy {
	billShow = false;
	subscription: Subscription;
	priorities: any[] = [];
	selectedPrescriptionItem: PrescriptionItem;
	@Input() currentPrescription: Prescription = <Prescription>{};
	constructor(
		private _drugInteractionService: DrugInteractionService,
		private _priorityService: PrescriptionPriorityService,
		private _drugListService: DrugListApiService
	) {
		this.subscription = this._drugInteractionService.currentInteraction.subscribe((value) => {
			if (
				this.currentPrescription.prescriptionItems !== undefined &&
				this.currentPrescription.prescriptionItems.length > 1
			) {
				this._drugListService
					.find_drug_interactions({ query: { rxcuis: value.map((drug) => drug.code) } })
					.then((payload) => {}, (error) => {});
			}
		});
	}

	ngOnInit() {
		this._getAllPriorities();
	}

	private _getAllPriorities() {
		this._priorityService
			.findAll()
			.then((res) => {
				this.priorities = res.data;
				const priority = res.data.filter((x) => x.name.toLowerCase().includes('normal'));
				if (priority.length > 0) {
					// this.allPrescriptionsForm.controls['priority'].setValue(priority[0]);
				}
			})
			.catch((err) => {});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	onBillShow(item) {
		this.selectedPrescriptionItem = item;
		this.billShow = true;
	}

	close_onClick(e) {
		this.billShow = false;
	}

	removePrescription(item) {
		this.currentPrescription.prescriptionItems = this.currentPrescription.prescriptionItems.filter(
			(i) => i._id !== item._id
		);
	}
}
