import { Component, OnInit, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, PrescriptionItem } from '../../../../../models/index';
import { Clients } from '../../../../../shared-module/helpers/global-config';
import { PharmacyEmitterService } from '../../../../../services/facility-manager/pharmacy-emitter.service';
import { FacilitiesService, PrescriptionService } from '../../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-prescription',
	templateUrl: './prescription.component.html',
	styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent implements OnInit {
	@Output() prescriptionItems: PrescriptionItem[] = [];
	facility: Facility = <Facility>{};
	billshow: boolean = false;
	prescriptionId: string = '';
	prescriptions: any[] = [];

	constructor(
		private _route: ActivatedRoute,
		private _locker: CoolLocalStorage,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		private _prescriptionService: PrescriptionService,
	) {

	}

	ngOnInit() {
		this._pharmacyEventEmitter.setRouteUrl('Prescription Details');
		this.facility = <Facility> this._locker.getObject('selectedFacility');

		this._route.params.subscribe(params => {
			this.prescriptionId = params['id'];
		});

		this.getPrescriptionDetails();
	}

	onClickDispense() {
		console.log();
	}

	// Get all drugs from generic
	getPrescriptionDetails() {
		this._prescriptionService.find({ query: { facilityId : this.facility._id, prescriptionId: this.prescriptionId }})
			.then(res => {
				console.log(res);
			})
			.catch(err => {
				console.log(err);
			});
	}

	billToggle() {
		this.billshow = !this.billshow;
	}
}
