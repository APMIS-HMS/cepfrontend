import { Component, OnInit } from '@angular/core';
import { FacilitiesService, WardAdmissionService } from '../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';

@Component({
	selector: 'app-ward-manager-setuppage',
	templateUrl: './ward-manager-setuppage.component.html',
	styleUrls: ['./ward-manager-setuppage.component.scss']
})
export class WardManagerSetuppageComponent implements OnInit {
	pageInView = 'Ward Setup';
	facility: Facility = <Facility>{};
	facilityWards: any[] = [];
	facilityWardId = '';

	constructor(private _facilitiesService: FacilitiesService,
		private _locker: CoolSessionStorage,
		private _wardAdmissionService: WardAdmissionService,
		private _wardEventEmitter: WardEmitterService,
		private _route: ActivatedRoute) {

		this._wardAdmissionService.listenerCreate.subscribe(payload => {
			this.getFacilityWard();
		});

		this._wardAdmissionService.listenerUpdate.subscribe(payload => {
			this.getFacilityWard();
		});
	}

	ngOnInit() {
		this._wardEventEmitter.setRouteUrl('Ward Setup');
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.getFacilityWard();
	}

	getFacilityWard() {
		if (this.facility) {
			this._facilitiesService.get(this.facility._id, {})
				.then(payload => {
					console.log(payload);
					this.facilityWards = payload.wards;
				})
				.catch(err => {
					this.facilityWards = [];
				});
		}
	}
}
