import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, BedOccupancyService } from '../../../../../services/facility-manager/setup/index';
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
		private _bedOccupancyService: BedOccupancyService,
    private _wardEventEmitter: WardEmitterService
  ) {
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
      this.loading = false;
      if (!!res._id) {
				const minorLocation = res.minorLocations.filter(x => x._id === this.wardId);
        if (minorLocation.length > 0) {
          const room = minorLocation[0].wardSetup.rooms.filter(x => x._id === this.roomId);
          if (room.length > 0) {
            this.wardRoom = room[0];
						this.beds = room[0].beds;
						console.log(this.beds);
          }
        }
      }
    });
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
