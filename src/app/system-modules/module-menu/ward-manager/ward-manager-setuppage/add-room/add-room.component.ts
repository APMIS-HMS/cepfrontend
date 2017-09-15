import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import {
	RoomGroupService, WardAdmissionService, FacilitiesServiceCategoryService, FacilitiesService
} from '../../../../../services/facility-manager/setup/index';
import { Facility, WardDetail, Room, WardRoom, User } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
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
	miniFacility: Facility = <Facility>{};
	wardDetail: WardDetail = <WardDetail>{};
	employeeDetails: any = <any>{};
	user: User = <User>{};
	room: Room = <Room>{};
	wardRoom: WardRoom = <WardRoom>{};
	servicePriceTags: any[] = [];
	groups: any[] = [];
	errMsg = 'You have unresolved errors';
	addRoomBtnText: String = '<i class="fa fa-plus"></i> Add Room';
	disableAddRoomBtn: Boolean = false;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _roomGroupService: RoomGroupService,
		private _wardAdmissionService: WardAdmissionService,
		public facilityService: FacilitiesService,
		private _locker: CoolLocalStorage,
		private fb: FormBuilder,
		private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService) {

	}

	ngOnInit() {
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.miniFacility = <Facility>this._locker.getObject('miniFacility');
		this.employeeDetails = this._locker.getObject('loginEmployee');
		this.user = <User>this._locker.getObject('auth');

		this.addRoomFormGroup = this.fb.group({
			room: ['', [<any>Validators.required]],
			group: ['', [<any>Validators.required]],
			service: ['', [<any>Validators.required]]
		});

		this._route.params.subscribe(params => {
			this.wardId = params['wardId'];
		});

		this.getWaitGroupItems();
		this.getServicePriceTag();
	}

	getWaitGroupItems() {
		this._roomGroupService.findAll().then(res => {
			this.groups = res.data;
		});
	}

	getServicePriceTag() {
		this._facilitiesServiceCategoryService.find({query: {facilityId: this.facility._id}}).then(res => {
			if (res.data.length > 0) {
				this.servicePriceTags = res.data[0].categories.filter(x => x.name === 'Ward');
			}
		}).catch(err => console.log(err));
	}

	addroom(value: any, valid: boolean) {
		if (valid) {
			console.log(value);
			this.disableAddRoomBtn = true;
			this.addRoomBtnText = 'Adding Room... <i class="fa fa-spinner fa-spin"></i>';
			this._wardAdmissionService.find({ query: { facilityId: this.facility._id } }).then(res => {
				console.log(res);
				const roomArray = [];
				const room = {
					name: value.room,
					groupId: value.group,
					serviceId: value.service
				};
				roomArray.push(room);
				const ward = {
					minorLocationId: this.wardId,
					rooms: roomArray
				};

				if (res.data.length > 0) {
					// Loop through locations.
					// If minorLocationId already exist?
					// Push room item into rooms, else push ward into locations.
					res.data[0].locations.forEach(item => {
						if (item.minorLocationId === this.wardId) {
							item.rooms.push(room);
						} else {
							res.data[0].locations.push(ward);
						}
					});
					// this.wardRoom.minorLocationId = this.wardId;
					// this.room.name = this.addRoomFormGroup.controls['room'].value;
					// this.room.groupId = this.addRoomFormGroup.controls['group'].value;
					// this.room.serviceId = this.addRoomFormGroup.controls['service'].value;
					// this.wardRoom.rooms = [];
					// this.wardRoom.rooms.push(this.room);
					// res.data[0].locations.forEach(item => {
					// 	console.log(item);
					// 	if (item.minorLocationId.toString() === this.wardId.toString()) {
					// 		item.rooms.push(this.room);
					// 	}
					// });
					// let counter = 0;
					// res.data[0].locations.forEach(itm => {
					// 	if (itm.minorLocationId.toString() !== this.wardId.toString()) {
					// 		counter += 1;
					// 	}
					// 	if (counter === res.data[0].locations.length) {
					// 		res.data[0].locations.push(this.wardRoom);
					// 	}
					// });
					this._wardAdmissionService.update(res.data[0]).then(updateRes => {
						console.log(updateRes);
						const text = value.room + ' has been added successfully';
						this._notification('Success', text);
						this.addRoomBtnText = '<i class="fa fa-plus"></i> Add Room';
						this.disableAddRoomBtn = false;
						this.addRoomFormGroup.reset();
						this.closeModal.emit(true);
					}).catch(err => console.log(err));
				} else {
					this.wardDetail.locations = [];
					this.wardRoom.rooms = [];
					const locationArray = [];
					locationArray.push(ward);
					const wardDetails = {
						facilityId: this.miniFacility,
						locations: locationArray
					};

					this._wardAdmissionService.create(wardDetails).then(createRes => {
						const text = value.room + ' has been added successfully';
						this._notification('Success', text);
						this.addRoomBtnText = '<i class="fa fa-plus"></i> Add Room';
						this.disableAddRoomBtn = false;
						this.addRoomFormGroup.reset();
						this.closeModal.emit(true);
					});
				}
			}).catch(err => console.log(err));
		}

	}

	// Notification
	private _notification(type: String, text: String): void {
		this.facilityService.announceNotification({
		  users: [this.user._id],
		  type: type,
		  text: text
		});
	  }

	close_onClick() {
		this.closeModal.emit(true);
	}
}
