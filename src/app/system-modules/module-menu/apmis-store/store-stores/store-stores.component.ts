import { Component, OnInit } from '@angular/core';
import { FacilitiesService } from './../../../../services/facility-manager/setup/facility.service';
import { LocationService } from './../../../../services/module-manager/setup/location.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router';
import { Facility } from 'app/models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-store-stores',
  templateUrl: './store-stores.component.html',
  styleUrls: ['./store-stores.component.scss']
})
export class StoreStoresComponent implements OnInit {

  tab_store = true;
  selectedFacility: any;
  stores: any = [];
  loc = '0';
  minorLocations: any = [];
  locations: any = [];
  storeLocations: any = [];
  formControlMinorLocation: FormControl = new FormControl();;
  formControlLocation: FormControl = new FormControl();

  constructor(private router: Router, private _locker: CoolLocalStorage,
    private facilitiesService: FacilitiesService,
    private locationService: LocationService) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.getFacilityService();
    this.getLocationService();
    this.formControlLocation.valueChanges.subscribe(value => {
      this.storeLocations = this.minorLocations.filter(x => x.locationId.toString() === value.toString());
      console.log(this.storeLocations);
    });

    this.formControlMinorLocation.valueChanges.subscribe(value => {
      this.loc = value;
    });
  }

  getFacilityService() {
    this.facilitiesService.get(this.selectedFacility._id, { query: { $select: ['minorLocations'] } }).then(payload => {
      this.minorLocations = payload.minorLocations;
      console.log(this.minorLocations);
    }, err => { })
  }

  getLocationService() {
    this.locationService.find({}).then(payload => {
      this.locations = payload.data;
      console.log(this.locations);
    }, err => { })
  }

  tab_click(tab) {
    if (tab === 'store') {
      this.tab_store = true;
    }
  }

  changeRoute(value: string) {
    this.router.navigate(['/dashboard/store/' + value]).then(
      payload => {
      }
    ).catch(error => {
    });
  }

}
