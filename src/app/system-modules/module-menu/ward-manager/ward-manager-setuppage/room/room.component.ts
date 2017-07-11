import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { FacilitiesService, WardAdmissionService, RoomGroupService, FacilitiesServiceCategoryService } from '../../../../../services/facility-manager/setup/index';
import { Facility, WardDetail, Room, WardRoom } from '../../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { WardEmitterService } from '../../../../../services/facility-manager/ward-emitter.service';

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.scss']
})

export class RoomComponent implements OnInit {
	addRoom = false;
	wardId: string;
	facility: Facility = <Facility>{};
	wardDetail: any = <any>{};
	roomItems: any[] = [];
	wardRoom: WardRoom = <WardRoom>{};
	wardServicePriceTags = [];
	roomNameEditShow: any;
	roomGroupItems = [];
	editRoomGroup = new FormControl();
	editRoomName = new FormControl();
	editServicePrice = new FormControl();

	constructor(
		private _route: ActivatedRoute,
		private router: Router,
		private _facilitiesService: FacilitiesService,
		private _locker: CoolSessionStorage,
		private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
		private _wardAdmissionService: WardAdmissionService,
		private _wardEventEmitter: WardEmitterService,
		private _roomGroupService: RoomGroupService) {

		this._wardAdmissionService.listenerCreate.subscribe(payload => {
			this.getWardRooomItems();
		});

		this._wardAdmissionService.listenerUpdate.subscribe(payload => {
			this.getWardRooomItems();
		});
		this.getWaitGroupItems();
		this.getServicePriceTag();
	}

	ngOnInit() {
		this._route.params.subscribe(params => {
			this.wardId = params['wardid'];
		});
		this._wardEventEmitter.setRouteUrl('Room Setup');
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.getWardRooomItems();
		this.getWaitGroupItems();
		this.getServicePriceTag();
	}

	roomNameEditToggle(indx) {
		this.roomNameEditShow[indx] = !this.roomNameEditShow[indx];
	}

	roomNameEdit(indx, model) {
		this.roomNameEditShow[indx] = !this.roomNameEditShow[indx];
		this._wardAdmissionService.find({ query: { facilityId: this.facility._id } })
			.then(payload => {
				payload.data[0].locations.forEach(item => {
					if (item.minorLocationId.toString() === this.wardId.toString()) {
						item.rooms.forEach(itm => {
							if (itm._id.toString() === model._id.toString()) {
								if (this.editRoomName.value != null || this.editRoomName.value !== undefined) {
									itm.name = this.editRoomName.value;
								}
								if (this.editRoomGroup.value != null || this.editRoomGroup.value !== undefined) {
									itm.groupId = this.editRoomGroup.value;
								}
								if (this.editServicePrice.value != null || this.editServicePrice.value !== undefined) {
									itm.serviceId = this.editServicePrice.value;
								}
								this._wardAdmissionService.update(payload.data[0]).then(t => {
									this.close_onClick();
								});
							}
						})
					}
				});
			});
	}

	getServicePriceTag() {
		this._facilitiesServiceCategoryService.find({query: {facilityId: this.facility._id}})
			.then(payload => {
				payload.data[0].categories.forEach(item => {
					if (item.name === 'Ward') {
						this.wardServicePriceTags = item.services;
					}
				});
			});
	}

	getWaitGroupItems() {
		this._roomGroupService.findAll()
			.then(payload => {
				this.roomGroupItems = payload.data;
			});
	}

	getWardRooomItems() {
		this._facilitiesService.get(this.facility._id, {})
			.then(payload => {
				payload.wards.forEach(item => {
					if (item._id.toString() === this.wardId.toString()) {
						console.log(item.wardDetails);
						if (item.wardDetails !== undefined) {
							this.roomItems = item.wardDetails.rooms;
						}
						this.wardDetail = item;
						this.roomNameEditShow = this.roomItems.map(i => false);
					}
				});
			});
	}


	addRoomModal() {
		this.addRoom = true;
	}

	close_onClick() {
		this.addRoom = false;
	}

}
