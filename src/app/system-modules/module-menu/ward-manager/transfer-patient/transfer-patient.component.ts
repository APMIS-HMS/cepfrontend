import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { WardAdmissionService, FacilitiesService, InPatientService } from '../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import * as myGlobals from '../../../../shared-module/helpers/global-config';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-transfer-patient',
	templateUrl: './transfer-patient.component.html',
	styleUrls: ['./transfer-patient.component.scss']
})
export class TransferPatientComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	transferFormGroup: FormGroup;
	facility: Facility = <Facility>{};
	inPatientId: string;
	mainErr = true;
	errMsg = 'you have unresolved errors';
	facilityWards: any[];

	constructor(
		private fb: FormBuilder,
		private _route: ActivatedRoute,
		private _facilitiesService: FacilitiesService,
		private _wardAdmissionService: WardAdmissionService,
		private _locker: CoolSessionStorage,
		private _inPatientService: InPatientService
	) { }

	ngOnInit() {
		this.transferFormGroup = this.fb.group({
			ward: ['', [<any>Validators.required]]
		});
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.getFacilityWard();
	}

	getFacilityWard() {
		this._facilitiesService.get(this.facility._id, {})
			.then(payload => {
				this.facilityWards = payload.wards;
			})
	}

	onTransfer(model: any, valid: boolean) {
		if (valid) {
			this._route.params.subscribe(params => {
				this.inPatientId = params['id'];
			});
			this._inPatientService.find({ query: { _id: this.inPatientId } })
				.then(payload => {
					payload.data[0].statusId = myGlobals.transfer;
					this._inPatientService.update(payload.data[0]).then(payload2 => {
						this.close_onClick();
					})
				})
		}
	}

	onWardChange(param) {
		console.log(param);
	}

	close_onClick() {
		this.closeModal.emit(true);
	}

}
