import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
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
	searchFormGroup: FormGroup;
	status: string[];
	prescriptionLists: any[] = [];
	loading: boolean = true;

	constructor(
		private _fb: FormBuilder,
		private _locker: CoolSessionStorage,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		private _prescriptionService: PrescriptionService,
	) {

	}

	ngOnInit() {
		this._pharmacyEventEmitter.setRouteUrl('Prescription List');
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.getAllPrescriptions();

		this.searchFormGroup = this._fb.group({
			search: ['', [<any>Validators]]
		});

		this.searchFormGroup.controls['search'].valueChanges.subscribe(val => {
			console.log(val);
			let searchText = val;
			const tempArray = [];

			this.loading = true;
			if(val.length > 2) {
				this.prescriptionLists.forEach(element => {
					if(element.patientName.includes(searchText)) {
						tempArray.push(element);
					}
				});

				this.loading = false;
				if(tempArray.length > 0) {
					this.prescriptionLists = tempArray;
				} else {
					this.prescriptionLists = [];
				}
			}
		});
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