import { Component, OnInit, Output } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { FacilitiesService, BedOccupancyService, RoomGroupService, FacilitiesServiceCategoryService } from '../../../../../services/facility-manager/setup/index';
import { Facility, WardDetail, Room, WardRoom } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { WardEmitterService } from '../../../../../services/facility-manager/ward-emitter.service';

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.scss']
})

export class RoomComponent implements OnInit {
	@Output() selectedRoom: any;
	addRoom = false;
	wardId: string;
	facility: Facility = <Facility>{};
	wardDetail: any = <any>{};
	rooms: any[] = [];
	wardRoom: WardRoom = <WardRoom>{};
	wardServicePriceTags = [];
	roomNameEditShow: any;
	roomGroupItems = [];
	editRoomGroup = new FormControl();
	editRoomName = new FormControl();
	editServicePrice = new FormControl();
	loading: Boolean = true;

	constructor(
		private _route: ActivatedRoute,
		private router: Router,
		private _facilitiesService: FacilitiesService,
		private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
		private _locker: CoolLocalStorage,
		private _bedOccupancyService: BedOccupancyService,
		private _wardEventEmitter: WardEmitterService,
		private _roomGroupService: RoomGroupService) {

	}

	ngOnInit() {
		this._route.params.subscribe(params => {
			this.wardId = params.wardId;
		});
		this._wardEventEmitter.setRouteUrl('Room Setup');
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.getWardRooomItems();
	}

	editRoom(index: Number, selectedRoom: any) {
		this.addRoom = true;
		this.selectedRoom = selectedRoom;
	}

	getWardRooomItems() {
    this._facilitiesService.get(this.facility._id, {}).then(res => {
			this.loading = false;
			if (!!res._id) {
        const rooms = res.minorLocations.filter(x => x._id === this.wardId);
        this.wardDetail = rooms[0];
        if (!!rooms[0].wardSetup && !!rooms[0].wardSetup.rooms && rooms[0].wardSetup.rooms.length > 0) {
          this.rooms = rooms[0].wardSetup.rooms;
        }
			}
		});
	}

	addRoomModal() {
		this.addRoom = true;
	}

	close_onClick() {
    this.getWardRooomItems();
    this.selectedRoom = undefined;
		this.addRoom = false;
	}

}
