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
  loading = true;
  minorLocations: MinorLocation[] = [];
  productTypes: any[] = [];
  stores: any[] = [];

  selMinorLocation = new FormControl();
  selProductType = new FormControl();
  searchControl = new FormControl();
  constructor(private locker: CoolLocalStorage, private productTypeService: ProductTypeService,
    private storeService: StoreService, private _storeEventEmitter: StoreEmitterService) {

    this.selMinorLocation.valueChanges.subscribe(value => {
      this.loading = true;
      this.storeService.getList(this.selectedFacility._id, { query: { minorLocationId: value } }).then(payload => {
        this.loading = false;
        this.stores = payload.data;
      });
    });

    this.selProductType.valueChanges.subscribe(value => {
      this.loading = true;
      this.storeService.getList(this.selectedFacility._id, { query: { 'productTypeId': value } }).then(payload => {
        this.loading = false;
        this.stores = payload.data;
      });
    });
  }


  ngOnInit() {
    this._storeEventEmitter.setRouteUrl('Store Manager');
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
    this.minorLocations = this.selectedFacility.minorLocations;
    this.getProductTypes();

    const subscribeForPerson = this.searchControl.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: any[]) => this.storeService.getList(this.selectedFacility._id, {
        query:
        {
          name: this.searchControl.value
        }
      }).then(payload => {
        this.loading = false;
        this.stores = payload.data;
      }));

    subscribeForPerson.subscribe((payload: any) => {
    });
    this.getStores();
    if (this.searchControl == null) {

    }
  }

  close_onClick(message: boolean): void {
    this.newStore = false;
  }

  refreshStore(value) {
    this.getStores();
  }


  newStoreShow() {
    this.newStore = true;
    this.selectedStore = <any>{};
  }

  getStores() {
    this.loading = true;
    this.storeService.getList(this.selectedFacility._id, {
      query:
        {
          name: ''
        }
    }).then(res => {
      this.loading = false;
      if (res.data.length !== 0) {
        this.stores = res.data;
      } else {
        this.stores = [];
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
    this.getStores();
  }
}
