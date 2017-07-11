import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { RoomGroupService, WardAdmissionService, FacilitiesServiceCategoryService } from '../../../../../services/facility-manager/setup/index';
import { Facility, WardDetail, Room, WardRoom } from '../../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-add-room',
	templateUrl: './add-room.component.html',
	styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	addRoomFormGroup: FormGroup;
	mainErr = true;
	wardId: string;
	facility: Facility = <Facility>{};
	wardDetail: WardDetail = <WardDetail>{};
	room: Room = <Room>{};
	wardRoom: WardRoom = <WardRoom>{};
	wardServicePriceTags: any[] = [];
	roomGroupItems: any[] = [];
	errMsg = 'you have unresolved errors';

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _roomGroupService: RoomGroupService,
		private _wardAdmissionService: WardAdmissionService,
		private _locker: CoolSessionStorage,
		private fb: FormBuilder,
		private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService) {

	}

	ngOnInit() {
		this.addRoomFormGroup = this.fb.group({
			room: ['', [<any>Validators.required]],
			group: ['', [<any>Validators.required]],
			service: ['', [<any>Validators.required]]
		});

		this.getWardId();

		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.getWaitGroupItems();
		this.getServicePriceTag();
	}

	getWaitGroupItems() {
		this._roomGroupService.findAll()
			.then(payload => {
				console.log(this.roomGroupItems);
				this.roomGroupItems = payload.data;
				console.log(this.roomGroupItems);
			});
	}

	getWardId() {
		this._route.params.subscribe(params => {
			this.wardId = params['wardid'];
		});
	}

	getServicePriceTag() {
		this._facilitiesServiceCategoryService.find({
			query: {
				facilityId: this.facility._id
			}
		}).then(payload => {
			payload.data[0].categories.forEach(item => {
				if (item.name === 'Ward') {
					this.wardServicePriceTags = item.services;
				}
			})
		})
	}

	addroom(model: any, valid: boolean) {
		if (valid) {

			this._wardAdmissionService.find({ query: { facilityId: this.facility._id } })
				.then(payload => {
					if (payload.data.length > 0) {
						this.wardRoom.minorLocationId = this.wardId;
						this.room.name = this.addRoomFormGroup.controls['room'].value;
						this.room.groupId = this.addRoomFormGroup.controls['group'].value;
						this.room.serviceId = this.addRoomFormGroup.controls['service'].value;
						this.wardRoom.rooms = [];
						this.wardRoom.rooms.push(this.room);
						payload.data[0].locations.forEach(item => {
							if (item.minorLocationId.toString() === this.wardId.toString()) {
								item.rooms.push(this.room);
							}
						})
						let counter = 0;
						payload.data[0].locations.forEach(itm => {
							if (itm.minorLocationId.toString() !== this.wardId.toString()) {
								counter += 1;
							}
							if (counter === payload.data[0].locations.length) {
								payload.data[0].locations.push(this.wardRoom);
							}
						})
						this._wardAdmissionService.update(payload.data[0]).then(callback => {
							this.addRoomFormGroup.reset();
						})
					}
					else {
						this.wardDetail.locations = [];
						this.wardRoom.rooms = [];
						this.wardRoom.minorLocationId = this.wardId;
						this.room.name = this.addRoomFormGroup.controls['room'].value;
						this.room.groupId = this.addRoomFormGroup.controls['group'].value;
						this.room.serviceId = this.addRoomFormGroup.controls['service'].value;
						this.wardRoom.rooms.push(this.room);
						this.wardDetail.locations.push(this.wardRoom);
						this.wardDetail.facilityId = this.facility._id;
						this._wardAdmissionService.create(this.wardDetail).then(callback => {
							this.addRoomFormGroup.reset();
						})
					}
				})
		}

	}


	close_onClick() {
		this.closeModal.emit(true);
	}
}
