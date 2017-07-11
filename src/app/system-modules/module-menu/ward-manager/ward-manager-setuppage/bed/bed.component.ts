import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, WardAdmissionService } from '../../../../../services/facility-manager/setup/index';
import { Facility, WardDetail, Room, WardRoom } from '../../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { WardEmitterService } from '../../../../../services/facility-manager/ward-emitter.service';

@Component({
	selector: 'app-bed',
	templateUrl: './bed.component.html',
	styleUrls: ['./bed.component.scss']
})
export class BedComponent implements OnInit {
	addbed = false;
	wardId: string;
	roomId: string;
	facility: Facility = <Facility>{};
	wardDetail: WardDetail = <WardDetail>{};
	bedItems: any[] = [];
	wardRoom: WardRoom = <WardRoom>{};
	bedNameEditShow: any;
	editBedName = new FormControl();

	constructor(private _route: ActivatedRoute,
		private router: Router,
		private _facilitiesService: FacilitiesService,
		private _locker: CoolSessionStorage,
		private _wardAdmissionService: WardAdmissionService,
		private _wardEventEmitter: WardEmitterService) {
		this._wardAdmissionService.listenerCreate.subscribe(payload => {
			this.getRooomBedItems();
		});

		this._wardAdmissionService.listenerUpdate.subscribe(payload => {
			this.getRooomBedItems();
		});
	}

	ngOnInit() {
		this._route.params.subscribe(params => {
			this.wardId = params['wardid'];
			this.roomId = params['roomid'];
		});
		this._wardEventEmitter.setRouteUrl('Bed Setup');
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.getRooomBedItems();
	}

	bedNameEditToggle(indx) {
		this.bedNameEditShow[indx] = !this.bedNameEditShow[indx];
	}

	bedNameEdit(indx, model) {
		this._wardAdmissionService.find({ query: { facilityId: this.facility._id } })
			.then(payload => {
				payload.data[0].locations.forEach(item => {
					if (item.minorLocationId.toString() === this.wardId.toString()) {
						item.rooms.forEach(itm => {
							if (itm._id.toString() === this.roomId.toString()) {
								itm.beds.forEach(bed => {
									if (bed._id.toString() === model._id.toString()) {
										bed.name = this.editBedName.value;
									}
								})
							}
						})
					}
				})
				this._wardAdmissionService.update(payload.data[0]).then(callback => {})
			})
	}

	getRooomBedItems() {
		this._wardAdmissionService.find({ query: { facilityId: this.facility._id } })
			.then(payload => {
				payload.data[0].locations.forEach(item => {
					if (item.minorLocationId.toString() === this.wardId.toString()) {
						item.rooms.forEach(itm => {
							if (itm._id.toString() === this.roomId.toString()) {
								this.bedItems = itm.beds;
								this.wardRoom = itm;
								this.bedNameEditShow = this.bedItems.map(i => false);
							}
						})
					}
				});
			});
	}

	addBedModal() {
		this.addbed = true;
	}

	close_onClick() {
		this.addbed = false;
	}

}
