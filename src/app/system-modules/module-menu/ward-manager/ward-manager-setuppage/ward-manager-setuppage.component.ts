import { Component, OnInit } from '@angular/core';
import { FacilitiesService, WardAdmissionService, } from '../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
import { LocationService } from 'app/services/module-manager/setup';

@Component({
	selector: 'app-ward-manager-setuppage',
	templateUrl: './ward-manager-setuppage.component.html',
	styleUrls: ['./ward-manager-setuppage.component.scss']
})
export class WardManagerSetuppageComponent implements OnInit {
	pageInView = 'Ward Setup';
	facility: Facility = <Facility>{};
	wards: any[] = [];
	facilityWardId = '';
	loading: Boolean = true;

	constructor(private _facilitiesService: FacilitiesService,
		private _locker: CoolLocalStorage,
    private _wardAdmissionService: WardAdmissionService,
    private _locationService: LocationService,
		private _wardEventEmitter: WardEmitterService,
		private _route: Router,
		private _router: ActivatedRoute) {

		// this._wardAdmissionService.listenerCreate.subscribe(payload => {
		// 	this.getFacilityWard();
		// });

		// this._wardAdmissionService.listenerUpdate.subscribe(payload => {
		// 	this.getFacilityWard();
		// });
	}

	ngOnInit() {
		this._wardEventEmitter.setRouteUrl('Ward Setup');
    this.facility = <Facility> this._locker.getObject('selectedFacility');
    this._getMajorLocation();
	}

	goToFacility() {
		this._route.navigate(['/dashboard/facility/locations']);
	}

  getFacilityWard(locationId) {
    this._facilitiesService.find({
      query: {
        '_id': this.facility._id,
        'minorLocations.locationId': locationId,
      }
    }).then(res => {
      this.loading = false;
      this.wards = res.data[0].minorLocations.filter(x => x.locationId === locationId);
		}).catch(err => console.log(err));
		// this._wardAdmissionService.find({query: {'facilityId._id': this.facility._id}}).then(res => {
		// 	this.loading = false;
		// 	if (res.data.length > 0) {
		// 		this.wards = res.data[0].locations;
		// 	}
		// });
  }

  private _getMajorLocation() {
    this._locationService.find({query: { name: 'Ward' }}).then(res => {
      if (res.data.length > 0) {
        const locationId = res.data[0]._id;
        this.getFacilityWard(locationId);
      }
    }).catch(err => {
    });
  }
}
