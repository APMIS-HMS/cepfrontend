import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import {
	RoomGroupService, WardAdmissionService, FacilitiesServiceCategoryService, FacilitiesService
} from '../../../../../services/facility-manager/setup/index';
import { Facility, WardDetail, Room, WardRoom, Bed, User } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-add-bed',
	templateUrl: './add-bed.component.html',
	styleUrls: ['./add-bed.component.scss']
})
export class AddBedComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() selectedBed: any;
	addBedFormGroup: FormGroup;
	mainErr = true;
	errMsg = 'You have unresolved errors';

	wardId: string;
	roomId: string;
	facility: Facility = <Facility>{};
	miniFacility: Facility = <Facility>{};
	wardDetail: WardDetail = <WardDetail>{};
	employeeDetails: any = <any>{};
	user: User = <User>{};
	room: Room = <Room>{};
	bed: Bed = <Bed>{};
	wardRoom: WardRoom = <WardRoom>{};
	addBedBtnText: String = '<i class="fa fa-plus"></i> Add Bed';
	disableAddBtn: Boolean = false;

	wardGroupItems: any[] = [];

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _wardGroupService: RoomGroupService,
		private _wardAdmissionService: WardAdmissionService,
		private _locker: CoolLocalStorage,
		private fb: FormBuilder,
		private facilityService: FacilitiesService
	) { }

	ngOnInit() {
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.miniFacility = <Facility>this._locker.getObject('miniFacility');
		this.employeeDetails = this._locker.getObject('loginEmployee');
		this.user = <User>this._locker.getObject('auth');

		this.addBedFormGroup = this.fb.group({
			bed: ['', [<any>Validators.required]]
		});

		console.log(this.selectedBed);
		this._route.params.subscribe(params => {
			this.wardId = params.wardId;
			this.roomId = params.roomId;
		});

		if (!!this.selectedBed) {
			this.addBedFormGroup.controls['bed'].setValue(this.selectedBed.name);
			this.addBedBtnText = 'Edit bed';
		}
	}

	addbed(value: any, valid: boolean) {
		if (valid) {
			// Edit bed
			if (!!this.selectedBed) {
				this.disableAddBtn = true;
				this.addBedBtnText = 'Editing Bed... <i class="fa fa-spinner fa-spin"></i>';
				this._wardAdmissionService.find({ query: { 'facilityId._id': this.facility._id } }).then(res => {
					res.data[0].locations.forEach(item => {
						if (item.minorLocationId === this.wardId) {
							item.rooms.forEach(itm => {
								if (itm._id === this.roomId) {
									itm.beds.forEach(bed => {
										if (bed._id === this.selectedBed._id) {
											bed.name = value.bed;
										}
									});
								}
							});
						}
					});
					this._wardAdmissionService.update(res.data[0]).then(updateRes => {
						const text = this.selectedBed.name + ' has been updated to ' + value.bed;
						this._notification('Success', text);
						this.disableAddBtn = false;
						this.addBedBtnText = '<i class="fa fa-plus"></i> Add Bed';
						this.closeModal.emit(true);
						this.addBedFormGroup.reset();
					});
				});
			} else {
				// Creating
				this.disableAddBtn = true;
				this.addBedBtnText = 'Adding Bed... <i class="fa fa-spinner fa-spin"></i>';
				this._wardAdmissionService.find({ query: { 'facilityId._id': this.facility._id } }).then(res => {
					if (res.data.length > 0) {
						res.data[0].locations.forEach(item => {
							if (item.minorLocationId === this.wardId) {
								item.rooms.forEach(itm => {
									if (itm._id === this.roomId) {
										const bed = {
											name: value.bed,
											isAvailable: true,
											state: 'Available'
										};
										itm.beds.push(bed);
										this._wardAdmissionService.update(res.data[0]).then(updateRes => {
											const text = value.bed + ' has been created successfully';
											this._notification('Success', text);
											this.disableAddBtn = false;
											this.addBedBtnText = '<i class="fa fa-plus"></i> Add Bed';
											this.closeModal.emit(true);
											this.addBedFormGroup.reset();
										});
									}
								});
							}
						});
					}
				});
			}
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
