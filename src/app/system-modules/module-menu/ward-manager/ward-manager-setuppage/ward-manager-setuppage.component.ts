import { Component, OnInit } from '@angular/core';
import { FacilitiesService, WardAdmissionService } from '../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
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
	loading: Boolean = true;

	constructor(private _facilitiesService: FacilitiesService,
		private _locker: CoolLocalStorage,
		private _wardAdmissionService: WardAdmissionService,
		private _wardEventEmitter: WardEmitterService,
		private _route: Router,
		private _router: ActivatedRoute) {

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

	goToFacility() {
		this._route.navigate(['/dashboard/facility/locations']);
	}

	getFacilityWard() {
		this._facilitiesService.get(this.facility._id, {}).then(payload => {
			this.loading = false;
			this.facilityWards = payload.wards;
		}).catch(err => console.log(err));
	}
}
