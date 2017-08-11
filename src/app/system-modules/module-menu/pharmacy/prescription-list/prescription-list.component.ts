import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FacilitiesService, PrescriptionService, DispenseService } from '../../../../services/facility-manager/setup/index';
import { Facility, Prescription, PrescriptionItem } from '../../../../models/index';
import { PharmacyEmitterService } from '../../../../services/facility-manager/pharmacy-emitter.service';

@Component({
	selector: 'app-prescription-list',
	templateUrl: './prescription-list.component.html',
	styleUrls: ['./prescription-list.component.scss']
})
export class PrescriptionListComponent implements OnInit {
	facility: Facility = <Facility>{};
	prescriptionFormGroup: FormGroup;
	walkinFormGroup: FormGroup;
	status: string[];
	prescriptionLists: any[] = [];
	noPrescriptionLists: any[] = [];
	tempPrescriptionLists: any[] = [];
	loading: boolean = true;
	noPresLoading: boolean = true;

	constructor(
		private _fb: FormBuilder,
		private _locker: CoolSessionStorage,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		private _prescriptionService: PrescriptionService,
		private _dispenseService: DispenseService
	) {

	}

	ngOnInit() {
		this._pharmacyEventEmitter.setRouteUrl('Prescription List');
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.getAllPrescriptions();
		this.getDispenses();

		this.prescriptionFormGroup = this._fb.group({
			search: [''],
			category: [''],
			date: [Date.now()]
		});

		// this.searchNonePrescriptionFormGroup = this._fb.group({
		// 	search: ['', [<any>Validators]]
		// });

		this.walkinFormGroup = this._fb.group({
			search: [''],
			category: [''],
			date: [Date.now()]
		});

		this.prescriptionFormGroup.controls['search'].valueChanges.subscribe(val => {
			let searchText = val;
			const tempArray = [];

			if(val.length > 2) {
				this.loading = true;
				this.prescriptionLists.forEach(element => {
					if(element.patientName.toLowerCase().includes(searchText.toLowerCase())) {
						tempArray.push(element);
					}
				});

				this.loading = false;
				if(tempArray.length > 0) {
					this.prescriptionLists = tempArray;
				} else {
					this.prescriptionLists = [];
				}
			} else {
				this.prescriptionLists = this.tempPrescriptionLists;
			}
		});
	}

	onChangeCategory(value: any) {
		console.log(value);
	}

	// Get all drugs from generic
	getAllPrescriptions() {
		this._prescriptionService.find({ query: { facilityId : this.facility._id }})
			.then(res => {
				console.log(res);
				this.loading = false;
				res.data.forEach(element => {
					if(!element.isDispensed) {
						let isBilledCount = 0;
						let preItemCount = element.prescriptionItems.length;
						element.prescriptionItems.forEach(preItem => {
							if(preItem.isBilled) {
								++isBilledCount;
							}
						});

						if(isBilledCount === preItemCount) {
							element.status = 'completely';
						} else if(isBilledCount === 0) {
							element.status = 'not';
						} else {
							element.status = 'partly';
						}

						this.tempPrescriptionLists.push(element);// temporary variable to search from.
						this.prescriptionLists.push(element);
					}
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	getDispenses() {
		this._dispenseService.find({ query: {facilityId: this.facility._id, isPrescription: false }}).then(res => {
			console.log(res);
			this.noPresLoading = false;
			if(res.data.length > 0) {
				this.noPrescriptionLists = res.data;
			} else {
				this.noPrescriptionLists = [];
			}
		}).catch(err => { console.log(err); });
	}

}