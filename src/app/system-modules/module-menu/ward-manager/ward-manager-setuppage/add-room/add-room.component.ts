import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import {
	RoomGroupService, WardAdmissionService, FacilitiesServiceCategoryService, FacilitiesService, FacilityPriceService
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
	groupId:any;
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
	disableAddRoomBtn: boolean = false;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _roomGroupService: RoomGroupService,
		private _wardAdmissionService: WardAdmissionService,
		public facilityService: FacilitiesService,
		private _locker: CoolLocalStorage,
    private fb: FormBuilder,
    private _facilityPrice: FacilityPriceService,
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
          this.disableAddRoomBtn = true;
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
		this._facilitiesServiceCategoryService.find({query: {
      facilityId: this.facility._id,
    }}).then(res => {
			if (res.data.length > 0) {
        const category = res.data[0].categories.filter(x => x.name === 'Ward');
        if (category.length > 0) {
          const categoryId = category[0]._id;
          this._facilityPrice.find({ query: {
            facilityId: this.facility._id,
          }}).then(data => {
            this.servicePriceTags = data.data.filter(x => x.categoryId === categoryId);
          });
        }
			}
		}).catch(err => console.log(err));
  }

	addroom(value: any, valid: boolean) {
		if (valid) {
			this.disableAddRoomBtn = true;
      if (!!this.selectedRoom) {
        this.addRoomBtnText = 'Editing Room... <i class="fa fa-spinner fa-spin"></i>';
            console.log(this.selectedRoom);
        this._wardAdmissionService.find({ query: { 'facilityId._id': this.facility._id } }).then(res => {
          // Delete serviceId records that are not required.
          delete value.service.modifiers;
          delete value.service.serviceItem;

          if (res.data.length > 0) {
              res.data[0].locations.forEach(item => {
                if (item.minorLocationId._id === this.wardId) {
                  item.rooms.forEach(roomItem => {
                    if (roomItem._id === this.selectedRoom._id) {
                      console.log(roomItem);
                      roomItem.serviceId = value.service;
                      roomItem.name = value.room;
                      roomItem.groupId = value.group;
                    }
                  });
                }
              });

              this._wardAdmissionService.update(res.data[0]).then(updateRes => {
              	console.log(updateRes);
              	const text = value.room + ' has been Updated successfully';
              	this._notification('Success', text);
              	this.addRoomBtnText = '<i class="fa fa-plus"></i> Add Room';
              	this.disableAddRoomBtn = false;
              	this.addRoomFormGroup.reset();
              	this.closeModal.emit(true);
              }).catch(err => console.log(err));
          }
        }).catch(err => console.log(err));
      } else {
        this.addRoomBtnText = 'Adding Room... <i class="fa fa-spinner fa-spin"></i>';
        this._wardAdmissionService.find({ query: { 'facilityId._id': this.facility._id } }).then(res => {
          // Delete serviceId records that are not required.
          delete value.service.modifiers;
          delete value.service.serviceItem;
          const room = {
            name: value.room,
            groupId: value.group,
            serviceId: value.service
          };
          console.log(room);

          if (res.data.length > 0) {
              res.data[0].locations.forEach(item => {
                if (item.minorLocationId._id === this.wardId) {
                  item.rooms.push(room);
                }
              });

              this._wardAdmissionService.update(res.data[0]).then(updateRes => {
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
    this.selectedRoom = undefined;
		this.closeModal.emit(true);
	}
}
