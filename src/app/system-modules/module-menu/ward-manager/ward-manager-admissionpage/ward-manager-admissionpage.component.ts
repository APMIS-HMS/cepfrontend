import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WardAdmissionService, InPatientListService, InPatientService } from '../../../../services/facility-manager/setup/index';
import { Facility, InPatient, WardTransfer } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
import * as myGlobals from '../../../../shared-module/helpers/global-config';

@Component({
	selector: 'app-ward-manager-admissionpage',
	templateUrl: './ward-manager-admissionpage.component.html',
	styleUrls: ['./ward-manager-admissionpage.component.scss']
})
export class WardManagerAdmissionpageComponent implements OnInit {
	admitPatient = false;
	transferReqShow = false;
	transferInShow = false;
	transferOutShow = false;
	newAdmissionShow = true;
	dischargeShow = false;
	_wardTransfer: WardTransfer = <WardTransfer>{};
	@Output() pageInView: EventEmitter<string> = new EventEmitter<string>();

	typeChecker: any = myGlobals;
	selectInpatient: any;
	listPatientAdmissionWaiting: any[] = [];
	listPatientTransferWaiting: any[] = [];
	listPatientDischarge: any[] = [];
	facility: Facility = <Facility>{};

	constructor(
		private _inPatientListService: InPatientListService,
		private _locker: CoolSessionStorage,
		private _wardEventEmitter: WardEmitterService,
		private _inPatientService:InPatientService,
		// private gvariable: globalConfig
		) {
		this._inPatientListService.listenerCreate.subscribe(payload => {
			this.getWaitingList();
		});

		this._inPatientListService.listenerUpdate.subscribe(payload => {
			this.getWaitingList();
		});
	}

	ngOnInit() {
		this._wardEventEmitter.setRouteUrl('Admission waiting list');
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.newAdmissionTab();
	}

	newAdmissionTab() {
		this.newAdmissionShow = true;
		this.transferInShow = false;
		this.transferOutShow = false;
		this.dischargeShow = false;
		this.getWaitingList();
	}

	transferInTab() {
		this.newAdmissionShow = false;
		this.transferInShow = true;
		this.transferOutShow = false;
		this.dischargeShow = false;
		this.getTransferInList();
	}

	transferOutTab() {
		this.newAdmissionShow = false;
		this.transferInShow = false;
		this.transferOutShow = true;
		this.dischargeShow = false;
	}

	dischargeTab() {
		this.newAdmissionShow = false;
		this.transferInShow = false;
		this.transferOutShow = false;
		this.dischargeShow = true;
		this.getDischargeList();
	}

	admitPatient_onClick(model: any, typeChecker = myGlobals) {
		this.selectInpatient = model;
		this.selectInpatient.typeChecker = typeChecker.onAdmission;
		this.admitPatient = true;
	}

	transferAdmitPatient_onClick(model: any, typeChecker = myGlobals) {
		this.selectInpatient = model;
		this.selectInpatient.typeChecker = typeChecker.transfer;
		this.admitPatient = true;
	}

	close_onClick() {
		this.admitPatient = false;
	}

	onClickDeclineTransfer(inpatientItem) {
		this._inPatientService.get(inpatientItem._id, {})
			.then(payload => {
				console.log(payload);
				payload.statusId = myGlobals.onAdmission;
				payload.transfers[payload.lastIndex].proposedWard = {};
				// Update the checkOutDate of the last tranfer
				this._inPatientService.update(payload)
					.then(payload1 => {
						this.getTransferInList();
					})
					.catch(err => {
						console.log(err);
					});
			});
	}

	getWaitingList() {
		this._inPatientListService.find({ query: { facilityId: this.facility._id, isAdmitted: false } })
			.then(payload => {
				console.log(payload);
				if (payload.data.length !== 0) {
					this.listPatientAdmissionWaiting = payload.data;
				} else {
					this.listPatientAdmissionWaiting = [];
				}
			});
	}

	getTransferInList() {
		this._inPatientService.find({ query: { facilityId: this.facility._id, statusId: myGlobals.transfer, discharge: undefined } })
			.then(payload => {
				console.log(payload.data);
				if (payload.data.length !== 0) {
					this.listPatientTransferWaiting = payload.data;
				} else {
					this.listPatientTransferWaiting = [];
				}
			});
	}

	getDischargeList() {
		this._inPatientService.find({ query: { facilityId: this.facility._id, statusId: myGlobals.discharge } })
			.then(payload => {
				if (payload.data.length !== 0) {
					this.listPatientDischarge = payload.data;
				} else {
					this.listPatientDischarge = [];
				}
			});
	}
}
