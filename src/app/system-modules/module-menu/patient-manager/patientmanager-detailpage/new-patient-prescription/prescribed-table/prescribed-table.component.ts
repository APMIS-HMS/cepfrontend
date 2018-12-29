import { DrugListApiService } from './../../../../../../services/facility-manager/setup/drug-list-api.service';
import { DrugInteractionService } from './../services/drug-interaction.service';
import { Component, OnInit, Output, Input, OnDestroy } from '@angular/core';
import { Prescription } from 'app/models';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-prescribed-table',
	templateUrl: './prescribed-table.component.html',
	styleUrls: [ './prescribed-table.component.scss' ]
})
export class PrescribedTableComponent implements OnInit, OnDestroy {
	billShow = false;
	subscription: Subscription;
	@Input() currentPrescription: Prescription = <Prescription>{};
	constructor(private _drugInteractionService: DrugInteractionService, private _drugListService: DrugListApiService) {
		this.subscription = this._drugInteractionService.currentInteraction.subscribe((value) => {
			if (
				this.currentPrescription.prescriptionItems !== undefined &&
				this.currentPrescription.prescriptionItems.length > 1
			) {
				this._drugListService
					.find_drug_interactions({ query: { rxcuis: value.map((drug) => drug.code) } })
					.then(
						(payload) => {
							console.log(payload);
						},
						(error) => {
							console.log(error);
						}
					);
			}
		});
	}

	ngOnInit() {}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	onBillShow() {
		this.billShow = true;
	}

	close_onClick(e) {
		this.billShow = false;
	}
}
