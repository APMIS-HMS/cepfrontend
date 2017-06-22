import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { WardDischargeTypesService, InPatientService, WardAdmissionService, BillingService } from '../../../../services/facility-manager/setup/index';
import { ActivatedRoute } from '@angular/router';
import { WardDischarge, Facility, BillModel, BillItem } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import * as myGlobals from '../../../../shared-module/helpers/global-config';

@Component({
	selector: 'app-discharge-patient',
	templateUrl: './discharge-patient.component.html',
	styleUrls: ['./discharge-patient.component.scss']
})
export class DischargePatientComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	dischargeFormGroup: FormGroup;
	mainErr = true;
	errMsg = 'you have unresolved errors';
	dischargeTypeItems: any[];
	inPatientId: string;
	discharge: any = <any>{};
	facility: Facility = <Facility>{};
	bill: BillModel = <BillModel>{};

	constructor(
		private fb: FormBuilder,
		private _wardDischargeTypesService: WardDischargeTypesService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _locker: CoolLocalStorage,
		private _inPatientService: InPatientService,
		private _wardAdmissionService: WardAdmissionService,
		private _billingService: BillingService) { }

	ngOnInit() {
		this.dischargeFormGroup = this.fb.group({
			dischargeType: ['', [<any>Validators.required]],
			comment: ['', [<any>Validators.required]]
		});
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this._wardDischargeTypesService.findAll()
			.then(payload => {
				console.log(payload.data);
				this.dischargeTypeItems = payload.data;
			})
	}

	onDischarge(model: any, valid: boolean) {
		if (valid) {
			this._route.params.subscribe(params => {
				this.inPatientId = params['id'];
				console.log(this.inPatientId);
			});
			this._inPatientService.get(this.inPatientId, {})
				.then(payload => {
					const inPatientVal = payload;
					this.discharge.dischargeTypeId = this.dischargeFormGroup.controls['dischargeType'].value;
					this.discharge.Reason = this.dischargeFormGroup.controls['comment'].value;
					payload.discharge = this.discharge;
					payload.statusId = myGlobals.discharge;
					payload.transfers[payload.lastIndex].checkOutDate = new Date();
					this._inPatientService.update(payload).then(payload2 => {
						this.close_onClick();
						const currentWard = payload.transfers[payload.lastIndex];
						this._wardAdmissionService.find({ query: { facilityId: this.facility } })
							.then(payload3 => {
								payload3.data[0].locations.forEach(location => {
									if (location.minorLocationId === currentWard.minorLocationId) {
										location.rooms.forEach(room => {
											if (room._id === currentWard.roomId) {
												room.beds.forEach(bed => {
													if (bed._id === currentWard.bedId) {
														bed.isAvailable = true;
														this._wardAdmissionService.update(payload3.data[0]).then(payload4 => {
															// console.log("Complete");
															this._router.navigate(['/modules/ward-manager/admitted']);
														})
													}
												})
											}
										})
									}
								})

							})
					}, error => {
						console.log(error)
					})
				})
		}
	}

	dischargeBillService() {

	}

	onDischargeTypeChange(param) {
		console.log(param);
	}

	close_onClick() {
		this.closeModal.emit(true);
	}

}
