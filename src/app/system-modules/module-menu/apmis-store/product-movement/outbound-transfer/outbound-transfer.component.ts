import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilitiesService } from './../../../../../services/facility-manager/setup/facility.service';
import { LocationService } from './../../../../../services/module-manager/setup/location.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { StoreService } from './../../../../../services/facility-manager/setup/store.service';
import { InventoryTransferService } from './../../../../../services/facility-manager/setup/inventory-transfer.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Facility, Employee } from 'app/models';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import { EmployeeService } from '../../../../../services/facility-manager/setup/index';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';

@Component({
  selector: 'app-outbound-transfer',
  templateUrl: './outbound-transfer.component.html',
  styleUrls: ['./outbound-transfer.component.scss']
})
export class OutboundTransferComponent implements OnInit, OnDestroy {

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
  // storeId = '5c043868d585f38d1a730924';

  loginEmployee: Employee = <Employee>{};
  checkingStore: any = <any>{};
  workSpace: any;
  isRunningQuery = false;
  subscription: ISubscription;
  showDialog = false;

  constructor(private facilitiesService: FacilitiesService,
    private locationService: LocationService,
    private _locker: CoolLocalStorage,
    private storeService: StoreService,
    private inventoryTransferService: InventoryTransferService,
    private systemModuleService: SystemModuleService,
    private _employeeService: EmployeeService,
    private authFacadeService: AuthFacadeService) {
    this.subscription = this._employeeService.checkInAnnounced$.subscribe((res) => {
      if (!!res) {
        if (!!res.typeObject) {
          this.checkingStore = res.typeObject;
          console.log(this.checkingStore);
          if (!!this.checkingStore.storeId) {
            const _id = (this.storeName.value === null) ? null : this.storeName.value._id;
            this.getSelectedStoreSummations(_id)
          }
        }
      }
    });
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      this.checkingStore = this.loginEmployee.storeCheckIn.find((x) => x.isOn === true);
      console.log(this.checkingStore);
      if (this.loginEmployee.storeCheckIn === undefined || this.loginEmployee.storeCheckIn.length === 0) {
        // this.modal_on = true;
      } else {
        let isOn = false;
        this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
          if (itemr.isDefault === true) {
            itemr.isOn = true;
            itemr.lastLogin = new Date();
            isOn = true;
            let checkingObject = { typeObject: itemr, type: 'store' };
            this._employeeService
              .patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
              .then((payload) => {
                this.loginEmployee = payload;
                checkingObject = { typeObject: itemr, type: 'store' };
                this._employeeService.announceCheckIn(checkingObject);
                this._locker.setObject('checkingObject', checkingObject);
              });
          }
        });
        if (isOn === false) {
          this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
            if (r === 0) {
              itemr.isOn = true;
              itemr.lastLogin = new Date();
              this._employeeService
                .patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
                .then((payload) => {
                  this.loginEmployee = payload;
                  const checkingObject = { typeObject: itemr, type: 'store' };
                  this._employeeService.announceCheckIn(checkingObject);
                  this._locker.setObject('checkingObject', checkingObject);
                });
            }
          });
        }
      }
    });
  }

  ngOnInit() {
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.getFacilityService();
    this.storeLocation.valueChanges.subscribe(value => {
      this.getStores();
    });
    this.storeName.valueChanges.subscribe(value => {
      this.getSelectedStoreSummations(value._id);
    });
    this.getSelectedStoreSummations();
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


  getSelectedStoreSummations(destinationStoreId?) {
    console.log('Am here');
    console.log(destinationStoreId);
    this.systemModuleService.on();
    let query = {
      facilityId: this.selectedFacility._id,
      storeId: this.checkingStore.storeId,
      destinationStoreId: destinationStoreId
    };
    if (query.destinationStoreId === null) {
      delete query.destinationStoreId;
    }
    this.inventoryTransferService.find({ query: query }).then(payload => {
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


  ngOnDestroy() {
    if (this.loginEmployee.storeCheckIn !== undefined) {
      this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
        if (itemr.isDefault === true && itemr.isOn === true) {
          itemr.isOn = false;
          this._employeeService.update(this.loginEmployee).then((payload) => {
            this.loginEmployee = payload;
          });
        }
      });
    }
    this._employeeService.announceCheckIn(undefined);
    this._locker.setObject('checkingObject', {});
    this.subscription.unsubscribe();
  }
}
