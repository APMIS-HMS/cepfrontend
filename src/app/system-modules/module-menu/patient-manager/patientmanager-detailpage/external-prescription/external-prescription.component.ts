import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Facility, Prescription, PrescriptionItem } from '../../../../../models/index';
import {
	FacilitiesService, PrescriptionService
} from '../../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-external-prescription',
	templateUrl: './external-prescription.component.html',
	styleUrls: ['./external-prescription.component.scss']
})
export class ExternalPrescriptionComponent implements OnInit {
	@Input() patientDetails: any;
	facility: Facility = <Facility>{};
	prescriptions: any = [];
	loading: boolean = true;

	constructor(
		private _locker: CoolSessionStorage,
		private _prescriptionService: PrescriptionService,
		private _facilityService: FacilitiesService
	) { }

	ngOnInit() {
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		console.log(this.patientDetails);

		this.getAllPrescriptions();
	}

	// Get all prescription for the patient
	// then filter is by the prescriptions that are external
	getAllPrescriptions() {
		this._prescriptionService.find({ query: { facilityId: this.facility._id, patientId: this.patientDetails._id}})
			.then(res => {
				console.log(res);
				this.prescriptions = res.data;
			})
			.catch(err => {
				console.log(err);
			});
	}
}
