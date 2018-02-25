import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
import { Router, ActivatedRoute } from '@angular/router';
import { InPatientService } from '../../../../services/facility-manager/setup/index';
import * as myGlobals from '../../../../shared-module/helpers/global-config';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-ward-manager-admitted-detailspage',
	templateUrl: './ward-manager-admitted-detailspage.component.html',
	styleUrls: ['./ward-manager-admitted-detailspage.component.scss']
})
export class WardManagerAdmittedDetailspageComponent implements OnInit {
	dischargePatient = false;
	transferPatient = false;
	admittedPatientId: string;
	selectedPatient: any;

	constructor(private _wardEventEmitter: WardEmitterService,
		private _route: ActivatedRoute,
		private _router: Router,
    public _inPatientService: InPatientService,
    private _systemModuleService : SystemModuleService
  ) {
		// this._inPatientService.listenerCreate.subscribe(payload => {
		// 	this.getAdmittedPatientItems();
		// });

		// this._inPatientService.listenerUpdate.subscribe(payload => {
		// 	this.getAdmittedPatientItems();
		// });
	}

	ngOnInit() {
		// this is for the pageInView header
		this._wardEventEmitter.setRouteUrl('Admitted Patient Details');

		this._route.params.subscribe(params => {
			this.admittedPatientId = params.id;
      this.getAdmittedPatientItems();
		});
	}

	getAdmittedPatientItems() {
		this._inPatientService.get(this.admittedPatientId, {}).then(res => {
      if (!!res._id) {
				let wardDetails = res.transfers[res.lastIndex];
				this.selectedPatient = res;
        this.selectedPatient.wardItem = wardDetails;
        // Check if the patient has been discharged.
        if (res.status === myGlobals.discharge) {
          let patient = `${res.patient.personDetails.firstName} ${res.patient.personDetails.lastName}`;
          let text = `${patient} has been discharged.`;
          this._systemModuleService.announceSweetProxy(text, 'error');
        }
			}
    });
	}

	onClickDischargePatient() {
		this.dischargePatient = true;
	}

	onClickTransferPatient() {
		this.transferPatient = true;
	}

	close_onClick() {
		this.dischargePatient = false;
		this.transferPatient = false;
	}

}
