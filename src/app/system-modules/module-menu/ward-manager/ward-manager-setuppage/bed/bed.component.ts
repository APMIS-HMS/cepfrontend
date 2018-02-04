import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, WardAdmissionService } from '../../../../../services/facility-manager/setup/index';
import { Facility, WardDetail, Room, WardRoom, User } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { WardEmitterService } from '../../../../../services/facility-manager/ward-emitter.service';

@Component({
	selector: 'app-bed',
	templateUrl: './bed.component.html',
	styleUrls: ['./bed.component.scss']
})
export class BedComponent implements OnInit {
	@Output() selectedBed: any;
	addbed = false;
	wardId: string;
	roomId: string;
	facility: Facility = <Facility>{};
	wardDetail: WardDetail = <WardDetail>{};
	user: User = <User>{};
	beds: any[] = [];
	wardRoom: WardRoom = <WardRoom>{};
	bedNameEditShow: any;
	editBedName = new FormControl();
	loading = false;

	constructor(private _route: ActivatedRoute,
		private router: Router,
		public facilityService: FacilitiesService,
		private _locker: CoolLocalStorage,
		private _wardAdmissionService: WardAdmissionService,
		private _wardEventEmitter: WardEmitterService) {
		// this._wardAdmissionService.listenerCreate.subscribe(payload => {
		// 	this.getRooomBedItems();
		// });

		// this._wardAdmissionService.listenerUpdate.subscribe(payload => {
		// 	this.getRooomBedItems();
		// });
	}

	ngOnInit() {
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.user = <User>this._locker.getObject('auth');
		this._route.params.subscribe(params => {
			this.wardId = params.wardId;
			this.roomId = params.roomId;
		});
		this._wardEventEmitter.setRouteUrl('Bed Setup');
		this.getRooomBedItems();
	}

	bedNameEdit(index: Boolean, selectedBed: any) {
		this.selectedBed = selectedBed;
		this.addBedModal();
	}

	getRooomBedItems() {
    this.facilityService.get(this.facility._id, {}).then(res => {
      console.log(res);
      this.loading = false;
      if (!!res._id) {
        const minorLocation = res.minorLocations.filter(x => x._id === this.wardId);
        console.log(minorLocation);
        if (minorLocation.length > 0) {
          const room = minorLocation[0].wardSetup.rooms.filter(x => x._id === this.roomId);
          console.log(room);
          if (room.length > 0) {
            this.wardRoom = room[0];
            this.beds = room[0].beds;
          }
        }
        // this.wardDetail = rooms[0];
        // if (!!rooms[0].wardSetup && !!rooms[0].wardSetup.rooms && rooms[0].wardSetup.rooms.length > 0) {
        //   this.rooms = rooms[0].wardSetup.rooms;
        // }
      }
    });
		// this._wardAdmissionService.find({ query: { 'facilityId._id': this.facility._id } }).then(res => {
		// 	if (res.data.length > 0) {
		// 		res.data[0].locations.forEach(item => {
		// 			if (item.minorLocationId._id === this.wardId) {
		// 				item.rooms.forEach(itm => {
		// 					if (itm._id === this.roomId) {
		// 						this.beds = itm.beds;
		// 						this.wardRoom = itm;
		// 						this.bedNameEditShow = this.beds.map(i => false);
		// 					}
		// 				})
		// 			}
		// 		});
		// 	}
		// });
	}

	// Notification
	private _notification(type: String, text: String): void {
		this.facilityService.announceNotification({
		  users: [this.user._id],
		  type: type,
		  text: text
		});
	  }

	addBedModal() {
		this.addbed = true;
	}

	close_onClick() {
    this.getRooomBedItems();
		this.selectedBed = undefined;
		this.addbed = false;
	}

}
