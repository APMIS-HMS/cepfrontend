import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { WardAdmissionService, InPatientService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from './../../../../models/index';
import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
// import { globalConfig } from '../../../../shared-module/helpers/global-config';
import * as myGlobals from '../../../../shared-module/helpers/global-config';

@Component({
	selector: 'app-ward-manager-admittedpage',
	templateUrl: './ward-manager-admittedpage.component.html',
	styleUrls: ['./ward-manager-admittedpage.component.scss']
})

export class WardManagerAdmittedpageComponent implements OnInit {
	@Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
	dischargePatient = false;
	filterFormGroup: FormGroup;
	facility: Facility = <Facility>{};
	admittedPatient: any[] = [];
	filterAdmittedPatient: any[];
	wardRoomLocationItems: any[] = [];
	wardRoomBedLocationItems: any[] = [];
	wardLocationItems: any[] = [];
	wardVal = new FormControl();
	roomVal = new FormControl();
	searchControl = new FormControl();

	public frmNewAdmit: FormGroup;

	constructor(private fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _wardEventEmitter: WardEmitterService,
		private _inPatientService: InPatientService,
		private _wardAdmissionService: WardAdmissionService,
		private _facilitiesService: FacilitiesService,
		// private gvariable: globalConfig
	) {
		this._inPatientService.listenerCreate.subscribe(payload => {
			this.getAdmittedItems();
		});

		this._inPatientService.listenerUpdate.subscribe(payload => {
			this.getAdmittedItems();
		});
	}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this._wardEventEmitter.setRouteUrl('Admitted Patients');
		console.log(this.facility);
		// this.filterFormGroup = this.fb.group({
		// 	ward: ['', [<any>Validators.required]],
		// 	room: ['', [<any>Validators.required]]
		// });
		this.getAdmittedItems();
		this.getwardLocationItems();

		// this.searchControl.valueChanges.subscribe(searchText => {
		// 	this.filterInPatientList(searchText);
		// });
	}

	onWardChange(param) {
		this.filterAdmittedPatient = [];
		this._wardAdmissionService.find({ query: { facilityId: this.facility._id } })
			.then(payload => {
				if (payload.data !== []) {
					this.admittedPatient = [];
					payload.data[0].locations.forEach(item => {
						if (item.minorLocationId.toString() === param.toString()) {
							this.wardRoomLocationItems = item.rooms;
							this._inPatientService.find({ query: { facilityId: this.facility._id } })
								.then(payload2 => {
									payload2.data.forEach(inPatientItem => {
										inPatientItem.transfers.forEach(transferItem => {
											if (transferItem.minorLocationId.toString() === param.toString()) {
												this.filterAdmittedPatient.push(inPatientItem);
											}
										})
										if (this.filterAdmittedPatient.length === 0) {
											this.getAdmittedItems();
										}
										else {
											this.admittedPatient = this.filterAdmittedPatient;
										}
									})
								})
						}
					})
				}
			});
	}

	onRoomChange(param) {
		this.filterAdmittedPatient = [];
		this._wardAdmissionService.find({ query: { facilityId: this.facility._id } })
			.then(payload => {
				if (payload.data !== []) {
					this.admittedPatient = []
					payload.data[0].locations.forEach(item => {
						item.rooms.forEach(itm => {
							if (itm._id.toString() === param.toString()) {
								this.wardRoomBedLocationItems = itm.beds;
								this._inPatientService.find({ query: { facilityId: this.facility._id } })
									.then(payload2 => {
										payload2.data.forEach(inPatientItem => {
											inPatientItem.transfers.forEach(transferItem => {
												if (transferItem.roomId.toString() === param.toString()) {
													this.filterAdmittedPatient.push(inPatientItem);
												}

											})
										})
										if (this.filterAdmittedPatient.length === 0) {
											this.getAdmittedItems();
										}
										else {
											this.admittedPatient =
												this.admittedPatient = this.filterAdmittedPatient;
										}

									})
							}
						})
					})
				}
			});
	}

	filterInPatientList(param) {
		this._wardAdmissionService.find({ query: { facilityId: this.facility._id } })
			.then(payload => {
				if (payload.data !== []) {
					this.admittedPatient = []
					payload.data[0].locations.forEach(item => {
						item.rooms.forEach(itm => {
							if (itm._id.toString() === this.roomVal.value.toString()) {
								this.wardRoomBedLocationItems = itm.beds;
								this._inPatientService.find({ query: { facilityId: this.facility._id } })
									.then(payload2 => {
										payload2.data.forEach(inPatientItem => {
											if (inPatientItem.patientDetails.personDetails.personFullName.includes(param)
												|| inPatientItem.patientDetails.personDetails.age.toString() === param
												|| inPatientItem.patientDetails.personDetails.personFullName.gender.name === param) {
												this.admittedPatient.push(inPatientItem);
											}
										})
									})
							}
						})
					})
				}
			});
	}

	onClickDischargePatient() {
		this.dischargePatient = true;
	}

	close_onClick() {
		this.dischargePatient = false;
	}

	getAdmittedItems() {
		this._inPatientService.find({ query: { facilityId: this.facility._id, statusId: myGlobals.onAdmission } })
			.then(payload => {
				if (payload.data.length !== 0) {
					console.log(payload.data);
					payload.data.forEach(item => {
						if (item.discharge == null) {
							// wardDetails.ward = payload.data.transfers[payload.data.lastIndex].name;
							// wardDetails.room = payload.data.transfers[payload.data.lastIndex].room;
							// wardDetails.bed = payload.data.transfers[payload.data.lastIndex].bed;

							this.admittedPatient = payload.data;
							// this.admittedPatient.wardItem = payload.data.transfers[payload.data.lastIndex];
							// this.admittedPatient.wardDetails = payload.data.transfers[payload.data.lastIndex];
							// this.admittedPatient.wardDetails = wardDetails;
						}
					});
				} else {
					this.admittedPatient = [];
				}
			});
	}

	getwardLocationItems() {
		this._facilitiesService.find({ query: { _id: this.facility._id } })
			.then(payload => {
				if (payload.data.length !== 0) {
					this.wardLocationItems = payload.data[0].wards;
				}
			});
	}


}
