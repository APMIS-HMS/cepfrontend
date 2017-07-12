import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { WardAdmissionService, InPatientService, InPatientListService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { Facility, InPatient, WardTransfer } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import * as myGlobals from '../../../../shared-module/helpers/global-config';

@Component({
	selector: 'app-admit-patient',
	templateUrl: './admit-patient.component.html',
	styleUrls: ['./admit-patient.component.scss']
})
export class AdmitPatientComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	admitFormGroup: FormGroup;
	@Input() inpatientItem: any;
	wardLocationItems: any[] = [];
	wardRoomLocationItems: any[] = [];
	wardRoomBedLocationItems: any[] = [];
	facility: Facility = <Facility>{};
	inPatient: InPatient = <InPatient>{};
	_wardTransfer: WardTransfer = <WardTransfer>{};


	admitPatient = false;
	mainErr = true;
	errMsg = 'You have unresolved errors';

	constructor(
		private _wardAdmissionService: WardAdmissionService,
		private fb: FormBuilder,
		private _locker: CoolSessionStorage,
		private router: Router,
		private _facilitiesService: FacilitiesService,
		private _inPatientService: InPatientService,
		private _inPatientListService: InPatientListService,
	) {
		this._wardAdmissionService.listenerCreate.subscribe(payload => {
			this.getwardRoomLocationItems();
		});

		this._wardAdmissionService.listenerUpdate.subscribe(payload => {
			this.getwardRoomLocationItems();
		});
	}

	ngOnInit() {
		this.admitFormGroup = this.fb.group({
			// ward: ['', [<any>Validators.required]],
			room: ['', [<any>Validators.required]],
			bed: ['', [<any>Validators.required]],
			desc: ['', [<any>Validators.required]],
		});
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.getwardRoomLocationItems();
	}



	// onWardChange(param) {
	// 	console.log(param);
	// 	this._wardAdmissionService.find({ query: { facilityId: this.facility._id } })
	// 		.then(payload => {
	// 			if (payload.data != []) {
	// 				payload.data[0].locations.forEach(item => {
	// 					if (item.minorLocationId.toString() === param.toString()) {
	// 						this.wardRoomLocationItems = item.rooms;
	// 					}
	// 				})
	// 			}
	// 		});
	// }

	onRoomChange(param) {
		this._wardAdmissionService.find({ query: { facilityId: this.facility._id } })
			.then(payload => {
				if (payload.data !== []) {
					payload.data[0].locations.forEach(item => {
						item.rooms.forEach(itm => {
							if (itm._id.toString() === param.toString()) {
								this.wardRoomBedLocationItems = itm.availableBed;
							}
						})
					})
				}
			});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}

	onAdmit(model: any, valid: boolean) {
		if (valid) {
			this.mainErr = true;
			if (this.inpatientItem.typeChecker === myGlobals.onAdmission) {
				this._inPatientListService.find({ query: { facilityId: this.facility._id, employeeId: this.inpatientItem.employeeId, isAdmitted: false } })
				.then(payload1 => {
					payload1.data[0].isAdmitted = true;
					payload1.data[0].admittedDate = new Date;
					this._inPatientListService.update(payload1.data[0]).then(callback1 => {
						this.inPatient.facilityId = this.facility._id;
						this.inPatient.statusId = myGlobals.onAdmission;
						this.inPatient.admitByEmployeeId = this.inpatientItem.employeeId;
						this.inPatient.patientId = this.inpatientItem.patientId;
						this._wardTransfer.minorLocationId = this.inpatientItem.wardId;
						this._wardTransfer.roomId = this.admitFormGroup.controls['room'].value;
						this._wardTransfer.bedId = this.admitFormGroup.controls['bed'].value;
						this._wardTransfer.description = this.admitFormGroup.controls['desc'].value;
						this._wardTransfer.checkInDate = new Date();
						this.inPatient.transfers = [];
						this.inPatient.transfers.push(this._wardTransfer);
						this.inPatient.admissionDate = new Date();
						this._inPatientService.create(this.inPatient).then(callback => {
							this.updateWardAdissionService();
							this.close_onClick();
						});
					});
				});
			} else if (this.inpatientItem.typeChecker === myGlobals.transfer) {
				this._inPatientService.get(this.inpatientItem._id, {})
					.then(payload => {
						payload.statusId = myGlobals.onAdmission;
						payload.transfers[payload.lastIndex].checkOutDate = new Date();
						this._wardTransfer.minorLocationId = payload.transfers[payload.lastIndex].proposeWard.minorLocationId;
						this._wardTransfer.roomId = this.admitFormGroup.controls['room'].value;
						this._wardTransfer.bedId = this.admitFormGroup.controls['bed'].value;
						this._wardTransfer.description = this.admitFormGroup.controls['desc'].value;
						this._wardTransfer.checkInDate = new Date();
						payload.transfers.push(this._wardTransfer);
						// Update the checkOutDate of the last tranfer
						this._inPatientService.update(payload)
							.then(payload1 => {
								this.router.navigate(['/dashboard/ward-manager/admitted']);
							}, err => {
								console.log(err);
							})
							.catch(err => {
								console.log(err);
							});
					});
			}
		} else {
			this.mainErr = false;
		}
	}

	getwardRoomLocationItems() {
		if (this.inpatientItem.typeChecker === myGlobals.transfer) {
			this._inPatientService.get(this.inpatientItem._id, {})
				.then(payload => {
					const rooms = payload.transfers[payload.lastIndex].proposeWard.ward.wardDetails.rooms;
					this.wardRoomLocationItems = rooms;
				});
		} else if (this.inpatientItem.typeChecker === myGlobals.onAdmission) {
			this._inPatientListService.get(this.inpatientItem._id, {})
				.then(payload => {
					this.wardRoomLocationItems = payload.wardDetails.wardDetails.rooms;
				});
		}
	}

	updateWardAdissionService() {
		this._wardAdmissionService.find({ query: { facilityId: this.facility._id } })
			.then(payload => {
				if (payload.data !== []) {
					payload.data[0].locations.forEach(item => {
						item.rooms.forEach(itm => {
							if (itm._id.toString() === this.admitFormGroup.controls['room'].value.toString()) {
								itm.beds.forEach(bed => {
									if (bed._id.toString() === this.admitFormGroup.controls['bed'].value.toString()) {
										bed.isAvailable = false;
										this._wardAdmissionService.update(payload.data[0]).then(completed => {
											// console.log("completed");
										});
									}
								})
							}
						})
					})
				}
			});
	}


}
