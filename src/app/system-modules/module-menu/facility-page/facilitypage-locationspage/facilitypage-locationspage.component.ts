import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';

import { Facility, Location } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-facilitypage-locationspage',
  templateUrl: './facilitypage-locationspage.component.html',
  styleUrls: ['./facilitypage-locationspage.component.scss']
})
export class FacilitypageLocationspageComponent implements OnInit {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();

  modal_on = false;
  newLocationModal_on = false;
  newSubLocModal_on = false;

  innerMenuShow = false;

  locationsObj: Location[] = [];

  locationObj: Location = <Location>{};
  filteredMinorLocations: any[] = [];

  // Department icons nav switches
  locationHomeContentArea = true;
  locationDetailContentArea = false;

  // Department list fields edit icon states
  locationEditNameIcoShow = false;
  locationEditShortNameIcoShow = false;
  locationEditDescIcoShow = false;

  sublocEditNameIcoShow = false;
  sublocEditShortNameIcoShow = false;
  sublocEditDescIcoShow = false;

  locationNameEdit = new FormControl();
  locationshortNameEdit = new FormControl();
  locationDescEdit = new FormControl();

  sublocNameEdit = new FormControl();
  sublocshortNameEdit = new FormControl();
  sublocDescEdit = new FormControl();
  isWardSelected: Boolean = false;
  facility: Facility = <Facility>{};

  constructor(private locationService: LocationService, private locker: CoolSessionStorage,
  public facilityService: FacilitiesService, private route: ActivatedRoute) {
    this.facilityService.listner.subscribe(payload => {
      this.facility = payload;
      this.filteredMinorLocations = this.facility.minorLocations.filter(x => x.locationId === this.locationObj._id);
    });
    this.locationService.listner.subscribe(payload => {
      this.getLocations();

    });
  }

  ngOnInit() {
    this.facility =   <Facility> this.facilityService.getSelectedFacilityId();
    this.pageInView.emit('Locations');

    this.locationNameEdit.valueChanges.subscribe(value => {
      // do something with value here
    });
    this.locationshortNameEdit.valueChanges.subscribe(value => {
      // do something with value here
    });
    this.locationDescEdit.valueChanges.subscribe(value => {
      // do something with value here
    });

    this.sublocNameEdit.valueChanges.subscribe(value => {
      // do something with value here
    });
    this.sublocshortNameEdit.valueChanges.subscribe(value => {
      // do something with value here
    });
    this.sublocDescEdit.valueChanges.subscribe(value => {
      // do something with value here
    });
    // this.getLocations();
    this.route.data.subscribe(data => {
      data['locations'].subscribe((payload: any) => {
        this.locationsObj = payload;
      });
    });
  }

  getLocations() {
    this.locationService.findAll().then(payload => {
      this.locationsObj = payload.data;
    });
  }

  locationDetailContentArea_show(model: Location) {
    this.locationHomeContentArea = false;
    this.locationDetailContentArea = true;
    this.innerMenuShow = false;
    console.log(model);
    if(model.name !== undefined && model.name.toLowerCase() === 'ward') {
      this.isWardSelected = true;
    }
    this.locationObj = model;
    
    this.filteredMinorLocations = this.facility.minorLocations.filter(x => x.locationId === this.locationObj._id);
  }

  locationDetailContentArea_remove(model: Location) {
    this.locationService.remove(model._id, model);
  }


  locationHomeContentArea_show() {
    this.locationHomeContentArea = true;
    this.locationDetailContentArea = false;
    this.innerMenuShow = false;
  }

  locationEditNameToggle() {
    this.locationEditNameIcoShow = !this.locationEditNameIcoShow;
  }
  locationEditShortNameToggle() {
    this.locationEditShortNameIcoShow = !this.locationEditShortNameIcoShow;
  }
  locationEditDescToggle() {
    this.locationEditDescIcoShow = !this.locationEditDescIcoShow;
  }

  sublocEditNameToggle() {
    this.sublocEditNameIcoShow = !this.sublocEditNameIcoShow;
  }
  sublocEditShortNameToggle() {
    this.sublocEditShortNameIcoShow = !this.sublocEditShortNameIcoShow;
  }
  sublocEditDescToggle() {
    this.sublocEditDescIcoShow = !this.sublocEditDescIcoShow;
  }

  newLocationModal_show() {
    this.modal_on = false;
    this.newLocationModal_on = true;
    this.newSubLocModal_on = false;
    this.innerMenuShow = false;
  }
  newSubLocationModal_show() {
    this.modal_on = false;
    this.newSubLocModal_on = true;
    this.newLocationModal_on = false;
    this.innerMenuShow = false;
  }
  close_onClick(message: boolean): void {
    this.modal_on = false;
    this.newSubLocModal_on = false;
    this.newLocationModal_on = false;
  }
  editMinorLoc(){
    this.modal_on = false;
    this.newSubLocModal_on = true;
    this.newLocationModal_on = false;
  }
  innerMenuToggle() {
    this.innerMenuShow = !this.innerMenuShow;
  }
  innerMenuHide(e) {
    if (e.srcElement.id !== 'submenu_ico') {
      this.innerMenuShow = false;
    }
  }
}
