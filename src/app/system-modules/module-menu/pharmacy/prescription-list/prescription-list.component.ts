import { Component, OnInit } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FacilitiesService, PrescriptionService } from '../../../../services/facility-manager/setup/index';
import { Facility, Prescription, PrescriptionItem } from '../../../../models/index';
import { PharmacyEmitterService } from '../../../../services/facility-manager/pharmacy-emitter.service';

@Component({
	selector: 'app-prescription-list',
	templateUrl: './prescription-list.component.html',
	styleUrls: ['./prescription-list.component.scss']
})
export class PrescriptionListComponent implements OnInit {
	facility: Facility = <Facility>{};
	status: string[];
	prescriptionLists: any[] = [];
	loading: boolean = true;

	constructor(
		private _locker: CoolLocalStorage,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		private _prescriptionService: PrescriptionService,
	) {

	}

	ngOnInit() {
		this._pharmacyEventEmitter.setRouteUrl('Prescription List');
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.getAllPrescriptions();
	}

	// Get all drugs from generic
	getAllPrescriptions() {
		this._prescriptionService.find({ query: { facilityId : this.facility._id }})
			.then(res => {
				console.log(res);
				this.loading = false;
				res.data.forEach(element => {
					if(!element.isDispensed) {
						this.prescriptionLists.push(element);
					}
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

}