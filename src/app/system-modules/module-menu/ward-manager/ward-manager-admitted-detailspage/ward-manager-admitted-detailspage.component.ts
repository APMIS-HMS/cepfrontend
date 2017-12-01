import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
import { Router, ActivatedRoute } from '@angular/router';
import { InPatientService } from '../../../../services/facility-manager/setup/index';

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
		public _inPatientService: InPatientService) {
		this._inPatientService.listenerCreate.subscribe(payload => {
			this.getAdmittedPatientItems();
		});

		this._inPatientService.listenerUpdate.subscribe(payload => {
			this.getAdmittedPatientItems();
		});
	}

	ngOnInit() {
		// this is for the pageInView header
		this._wardEventEmitter.setRouteUrl('Admitted Patient Details');
		this.getAdmittedPatientItems();

		this._route.params.subscribe(params => {
			this.admittedPatientId = params.id;
		});
	}

	getAdmittedPatientItems() {
		this._inPatientService.find({ query: { _id: this.admittedPatientId } }).then(res => {
			console.log(res);
			if (res.data.length !== 0) {
				let wardDetails = res.data[0].transfers[res.data[0].lastIndex];
				this.selectedPatient = res.data[0];
				this.selectedPatient.wardItem = wardDetails;
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
