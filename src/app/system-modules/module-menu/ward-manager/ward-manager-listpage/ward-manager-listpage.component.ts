import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
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
	wards: any[] = [];
	loading: Boolean = true;
	selectedIndex: Number = 0;

	constructor(
		private _route: Router,
		private _wardEventEmitter: WardEmitterService,
		private _wardAdmissionService: WardAdmissionService,
		private _facilitiesService: FacilitiesService,
		private _locker: CoolLocalStorage
	) {
		this._wardAdmissionService.listenerCreate.subscribe(payload => {
			this.getFacilityWard();
		});

		this._wardAdmissionService.listenerUpdate.subscribe(payload => {
			this.getFacilityWard();
		});
	}

	ngOnInit() {
		this._wardEventEmitter.setRouteUrl('Wards');
		this.facility = <Facility>  this._locker.getObject('selectedFacility');
		this.getFacilityWard();
	}

	getFacilityWard() {
		this._wardAdmissionService.find({ query: { 'facilityId._id': this.facility._id } }).then(res => {
			this.loading = false;
			let bedCount = 0;

			if (res.data.length > 0) {
				res.data[0].locations.forEach(ward => {
					ward.rooms.forEach(room => {
						if (room.beds.length > 0) {
							room.beds.forEach(bed => {
								if (bed.isAvailable) {
									room.availableBeds = ++bedCount;
								}
							});
						} else {
							room.availableBeds = 0;
						}
					});
				});
				this.wards = res.data[0].locations;
			}
		});
	}

	goToFacility() {
		this._route.navigate(['/dashboard/facility/locations']);
	}

	showDetails(index: Number) {
		this.selectedIndex = index;
	}

}
