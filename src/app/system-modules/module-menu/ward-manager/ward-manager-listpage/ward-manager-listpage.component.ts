import { Component, OnInit } from '@angular/core';
import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
import { WardAdmissionService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
	selector: 'app-ward-manager-listpage',
	templateUrl: './ward-manager-listpage.component.html',
	styleUrls: ['./ward-manager-listpage.component.scss']
})
export class WardManagerListpageComponent implements OnInit {
	facility: Facility = <Facility>{};
	facilityWards: any[] = [];

	constructor(
		private _wardEventEmitter: WardEmitterService,
		private _wardAdmissionService: WardAdmissionService,
		private _facilitiesService: FacilitiesService,
		private _locker: CoolLocalStorage) {
		this._wardAdmissionService.listenerCreate.subscribe(payload => {
			this.getFacilityWard();
		});

		this._wardAdmissionService.listenerUpdate.subscribe(payload => {
			this.getFacilityWard();
		});
	}

	ngOnInit() {
		// this is for the pageInView header
		this._wardEventEmitter.setRouteUrl('Wards');
		this.facility = <Facility>  this._locker.getObject('selectedFacility');
		this.getFacilityWard();
	}

	getFacilityWard() {
		this._facilitiesService.get(this.facility._id, {})
			.then(payload => {
				this.facilityWards = payload.wards;
			});
	}

}
