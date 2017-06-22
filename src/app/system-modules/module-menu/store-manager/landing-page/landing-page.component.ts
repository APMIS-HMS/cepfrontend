import { Component, OnInit, Input } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, MinorLocation } from '../../../../models/index';
import { FormControl } from '@angular/forms';
import { ProductTypeService, StoreService } from '../../../../services/facility-manager/setup/index';
import { StoreEmitterService } from '../../../../services/facility-manager/store-emitter.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  selectedFacility: Facility = <Facility>{};
  selectedMinorLocation: MinorLocation = <MinorLocation>{};
  selectedStore: any = <any>{};

  newStore = false;

  minorLocations: MinorLocation[] = [];
  productTypes: any[] = [];
  stores: any[] = [];

  selMinorLocation = new FormControl();
  selProductType = new FormControl();
  searchControl = new FormControl();
  constructor(private locker: CoolLocalStorage, private productTypeService: ProductTypeService,
    private storeService: StoreService, private _storeEventEmitter: StoreEmitterService) {
    this.storeService.listenerUpdate.subscribe(payload => {
      this.getStores();
    });
    this.selMinorLocation.valueChanges.subscribe(value => {
      this.storeService.find({ query: { minorLocationId: value } }).then(payload => {
        this.stores = payload.data;
      });
    });

    this.selProductType.valueChanges.subscribe(value => {
      this.storeService.find({ query: { 'productTypeId.productTypeId': value } }).then(payload => {
        this.stores = payload.data;
      });
    });
  }


  ngOnInit() {
    this._storeEventEmitter.setRouteUrl('Store Manager');
    this.selectedFacility = this.locker.get('selectedFacility');
    this.minorLocations = this.selectedFacility.minorLocations;
    this.getProductTypes();

    let subscribeForPerson = this.searchControl.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: any[]) => this.storeService.find({
        query:
        {
          name: this.searchControl.value,
          facilityId: this.selectedFacility._id
        }
      })
        .
        then(payload => {
          this.stores = payload.data;
        }))

    subscribeForPerson.subscribe((payload: any) => {
    });
    this.getStores();
    if (this.searchControl == null) {

    }
  }

  close_onClick(message: boolean): void {
    this.newStore = false;
  }


  newStoreShow() {
    this.newStore = true;
    this.selectedStore = <any>{};
  }

  getStores() {
    // this.storeService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
    //   this.stores = payload.data;
    //   console.log(payload);
    // }, error => {
    //   console.log(error);
    // });

    this.storeService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(payload => {
      if (payload.data.length != 0) {
        this.stores = payload.data;
      }
    });

  }
  getProductTypes() {
    this.productTypeService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.productTypes = payload.data;
    });
  }
  onEditStore(store) {
    this.selectedStore = store;
    this.newStore = true;
  }
  refresh(): void {
    window.location.reload();
  }
}