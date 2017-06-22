import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Locker } from 'angular2-locker';
import { Router, ActivatedRoute } from '@angular/router';

import { FacilitiesService, InPatientListService, InPatientService } from '../../../../services/facility-manager/setup/index';
import { Appointment, Facility } from '../../../../models/index';

@Component({
	selector: 'app-checkout-patient',
	templateUrl: './checkout-patient.component.html',
	styleUrls: ['./checkout-patient.component.scss']
})
export class CheckoutPatientComponent implements OnInit {

	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() selectedAppointment: Appointment = <Appointment>{};
	@Input() employeeDetails: any;

	patientId: string = "";
	employeeId: string = "";
	ward_checkout: boolean = false;
	admitFormGroup: FormGroup;
	facility: Facility = <Facility>{};
	wards: any[] = [];

	constructor(
		private _facilitiesService: FacilitiesService,
		private _locker: Locker,
		private fb: FormBuilder,
		private _router: Router,
		private _route: ActivatedRoute,
		private _inPatientListService: InPatientListService
	) { }

	ngOnInit() {
		this.facility = this._locker.get('selectedFacility');
		this.getAllWards();
		console.log(this.facility);
		console.log(this.selectedAppointment);
		console.log(this.employeeDetails);

		this._route.params.subscribe(params => {
			this.patientId = params['id'];
		});

		this.admitFormGroup = this.fb.group({
			ward: ['', [<any>Validators.required]]
		});
	}

	checkoutWard() {
		this.ward_checkout = true;
	}

	onClickAdmit(value: any, valid: boolean) {
		console.log(value);
		console.log(valid);
		if(valid) {
			let patient = {
				employeeId: this.employeeDetails.employeeDetails._id,
				patientId: this.patientId,
				facilityId: this.employeeDetails.facilityId,
				clinicId: this.selectedAppointment.clinicId,
				unitId: this.selectedAppointment.clinicId,
				wardId: this.admitFormGroup.controls['ward'].value
			};
			console.log(patient);
			this._inPatientListService.create(patient)
				.then(res => {
					console.log(res);
				})
				.catch(err => {
					console.log(err);
				});
		}
	}

	getAllWards() {
		this._facilitiesService.get(this.facility._id, {})
			.then(payload => {
				this.wards = payload.wards;
			})
			.catch(err => {
				console.log(err);
			});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
}
