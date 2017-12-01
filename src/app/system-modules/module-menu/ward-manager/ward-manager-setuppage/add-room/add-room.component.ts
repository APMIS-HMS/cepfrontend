import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
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
	@Input() selectedRoom: any;
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
	serviceId: any = <any>{};
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

		setTimeout(x => {
			if (!!this.selectedRoom) {
				if (this.groups.length > 0 && this.servicePriceTags.length > 0) {
					this.addRoomFormGroup.controls['room'].setValue(this.selectedRoom.name);
					this.addRoomFormGroup.controls['group'].setValue(this.selectedRoom.groupId);
					this.addRoomFormGroup.controls['service'].setValue(this.selectedRoom.serviceId);
					this.serviceId = this.selectedRoom.serviceId;
					this.addRoomBtnText = 'Edit Room';
				}
			}
		}, 2000);

		// this.addRoomFormGroup.controls['service'].valueChanges.subscribe(val => {
		// 	console.log(val);
		// 	this.noPrescriptionForm.controls['product'].setValue(event.srcElement.innerText);
		// 	this.selectedProductId = drugId.getAttribute('data-p-id');
		// });
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
			this.disableAddRoomBtn = true;
			this.addRoomBtnText = 'Adding Room... <i class="fa fa-spinner fa-spin"></i>';
			this._wardAdmissionService.find({ query: { 'facilityId._id': this.facility._id } }).then(res => {
				const room = {
					name: value.room,
					groupId: value.group,
					serviceId: value.service
				};

				if (res.data.length > 0) {
					res.data[0].locations.forEach(item => {
						if (item.minorLocationId._id === this.wardId) {
							item.rooms.push(room);
						}
					});
					this._wardAdmissionService.update(res.data[0]).then(updateRes => {
						console.log(updateRes);
						const text = value.room + ' has been added successfully';
						this._notification('Success', text);
						this.addRoomBtnText = '<i class="fa fa-plus"></i> Add Room';
						this.disableAddRoomBtn = false;
						this.addRoomFormGroup.reset();
						this.closeModal.emit(true);
					}).catch(err => console.log(err));
				}
			}).catch(err => console.log(err));
		}

	}

	onChangeService(item, serviceId) {
		console.log(item);
		console.log(serviceId);
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
