import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';

import { Facility, Location } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-facilitypage-locationspage',
  templateUrl: './facilitypage-locationspage.component.html',
  styleUrls: ['./facilitypage-locationspage.component.scss']
})
export class FacilitypageLocationspageComponent implements OnInit {
  selectedLocation: any;

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();

  modal_on = false;
  newLocationModal_on = false;
  newSubLocModal_on = false;

  innerMenuShow = false;
  showLoc = false;
  locationsObj: Location[] = [];

  locationObj: Location = <Location>{};
  subLocation: any = {};
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

  constructor(private locationService: LocationService, private locker: CoolLocalStorage,
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
    this.facility = <Facility>this.facilityService.getSelectedFacilityId();
    this.facilityService.listner.subscribe(payload => {
      this.facility = payload;
      this.filteredMinorLocations = this.facility.minorLocations.filter(x => x.locationId === this.locationObj._id);
    });
    this.pageInView.emit('Locations');
    this.route.data.subscribe(data => {
      data['locations'].subscribe((payload: any) => {
        this.locationsObj = payload;
        console.log(this.locationsObj);
      });
    });
  }
  showLoc_click(location) {
    this.selectedLocation = location;
    this.showLoc = true;
  }
  showMinorLocation_selectedLocation(location) {
    if (this.selectedLocation !== undefined) {
      return location._id === this.selectedLocation._id;
    }
    return false;
  }
  showLoc_hide() {
    this.showLoc = false;
    this.selectedLocation = undefined;
  }
  newLoc_onClick(minor) {
    this.locationObj = this.selectedLocation;
    this.subLocation = minor;
    this.newSubLocModal_on = true;
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
    if (model.name !== undefined && model.name.toLowerCase() == 'ward') {
      this.isWardSelected = true;
    } else {
      this.isWardSelected = false;
    }

    this.locationObj = model;

    this.filteredMinorLocations = this.facility.minorLocations.filter(x => x.locationId === this.locationObj._id);
    console.log(this.filteredMinorLocations);
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
  newSubLocationModal_show(location) {
    this.locationObj = location;
    this.modal_on = false;
    this.newSubLocModal_on = true;
    this.newLocationModal_on = false;
    this.innerMenuShow = false;
  }
  close_onClick(message: boolean): void {
    this.modal_on = false;
    this.newSubLocModal_on = false;
    this.newLocationModal_on = false;
    this.subLocation = <any>{};
  }
  editMinorLoc(value) {
    this.subLocation = value;
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
