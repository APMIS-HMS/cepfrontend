import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilitiesService } from './../../../../../services/facility-manager/setup/facility.service';
import { LocationService } from './../../../../../services/module-manager/setup/location.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { StoreService } from './../../../../../services/facility-manager/setup/store.service';
import { InventoryTransferService } from './../../../../../services/facility-manager/setup/inventory-transfer.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Facility } from 'app/models';

@Component({
  selector: 'app-outbound-transfer',
  templateUrl: './outbound-transfer.component.html',
  styleUrls: ['./outbound-transfer.component.scss']
})
export class OutboundTransferComponent implements OnInit {

  check: FormControl = new FormControl();
  storeLocation: FormControl = new FormControl();
  storeName: FormControl = new FormControl();
  selectedFacility: any;
  minorLocations: any = [];
  locations: any = [];
  stores: any = [];
  transferObjs: any = [];
  totalTransferredQties = 0;
  totalTransferredAmount = 0;
  storeId = '5c043868d585f38d1a730924';

  constructor(private facilitiesService: FacilitiesService,
    private locationService: LocationService,
    private _locker: CoolLocalStorage,
    private storeService: StoreService,
    private inventoryTransferService: InventoryTransferService,
    private systemModuleService: SystemModuleService) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.getFacilityService();
    this.storeLocation.valueChanges.subscribe(value => {
      this.getStores();
    });
    this.storeName.valueChanges.subscribe(value => {
      this.getSelectedStoreSummations();
    });
  }


  getFacilityService() {
    this.systemModuleService.on();
    this.facilitiesService.get(this.selectedFacility._id, { query: { $select: ['minorLocations'] } }).then(payload => {
      this.minorLocations = payload.minorLocations;
      this.systemModuleService.off();
    }, err => {
      this.systemModuleService.off();
    })
  }

  getLocationService() {
    this.locationService.find({}).then(payload => {
      this.locations = payload.data;
    }, err => { })
  }

  getStores() {
    this.systemModuleService.on();
    this.storeService.find({ query: { facilityId: this.selectedFacility._id, minorLocationId: this.storeLocation.value._id } }).then(payload => {
      this.stores = payload.data;
      this.systemModuleService.off();
    }, er => {
      this.systemModuleService.off();
    });
  }


  getSelectedStoreSummations() {
    this.systemModuleService.on();
    this.inventoryTransferService.find({ query: { facilityId: this.selectedFacility._id, storeId: this.storeId, destinationStoreId: this.storeName.value._id } }).then(payload => {
      console.log(payload);
      payload.data.map(x => {
        x.inventoryTransferTransactions.map(y => {
          this.transferObjs.push(y);
          this.totalTransferredAmount += y.lineCostPrice;
          this.totalTransferredQties += y.quantity;
        });
      });
      console.log(this.transferObjs);
      this.systemModuleService.off();
    }, err => {
      this.systemModuleService.off();
    });
  }

}
