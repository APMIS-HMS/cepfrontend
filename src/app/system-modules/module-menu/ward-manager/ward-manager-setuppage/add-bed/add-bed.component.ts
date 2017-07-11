import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { RoomGroupService, WardAdmissionService, FacilitiesServiceCategoryService } from '../../../../../services/facility-manager/setup/index';
import { Facility, WardDetail, Room, WardRoom, Bed } from '../../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-add-bed',
	templateUrl: './add-bed.component.html',
	styleUrls: ['./add-bed.component.scss']
})
export class AddBedComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	addBedFormGroup: FormGroup;
	mainErr = true;
	errMsg = 'you have unresolved errors';

	wardId: string;
	roomId: string;
	facility: Facility = <Facility>{};
	wardDetail: WardDetail = <WardDetail>{};
	room: Room = <Room>{};
	bed: Bed = <Bed>{};
	wardRoom: WardRoom = <WardRoom>{};

	wardGroupItems: any[] = [];

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _wardGroupService: RoomGroupService,
		private _wardAdmissionService: WardAdmissionService,
		private _locker: CoolSessionStorage,
		private fb: FormBuilder) { }

	ngOnInit() {
		this.addBedFormGroup = this.fb.group({
			bed: ['', [<any>Validators.required]]
		});
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.getWardId();
		
	}

	getWardId() {
		this._route.params.subscribe(params => {
			this.wardId = params['wardid'];
			this.roomId = params['roomid'];
		});
	}

	

	addbed(model: any, valid: boolean) {
		if (valid) {
			this._wardAdmissionService.find({ query: { facilityId: this.facility._id } })
				.then(payload => {
					payload.data[0].locations.forEach(item => {
						if (item.minorLocationId.toString() === this.wardId.toString()) {
							item.rooms.forEach(itm => {
								if (itm._id.toString() === this.roomId.toString()) {
									this.bed.name = this.addBedFormGroup.controls['bed'].value;
									itm.beds.push(this.bed);
									this._wardAdmissionService.update(payload.data[0]).then(callback => {
										this.addBedFormGroup.reset();
									})
								}
							})
						}
					})
				})
		}

	}

	close_onClick() {
		this.closeModal.emit(true);
	}
}
