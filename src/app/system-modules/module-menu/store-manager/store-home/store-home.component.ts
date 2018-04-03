import { Component, OnInit, OnDestroy } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { InventoryService, ProductService, EmployeeService, FacilitiesService, StoreService, PurchaseOrderService, InventoryTransferService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { Facility, Inventory, Employee, User } from '../../../../models/index';

@Component({
  selector: 'app-store-home',
  templateUrl: './store-home.component.html',
  styleUrls: ['./store-home.component.scss']
})
export class StoreHomeComponent implements OnInit, OnDestroy {
  inventories: any[] = [];
  purchaseOrders: any[] = [];
  transfers: any[] = [];
  checkingStore: any = <any>{};
  inventoryLoading = true;
  purchaseOrderLoading = true;
  transferLoading = true;
  modal_on = false;
  inventoryCount = 0;
  purchaseOrderCount = 0;
  transferCount = 0;
  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  workSpace: any;
  Ql_toggle = false;

  constructor(
    // private _inventoryService: InventoryService,
    private _purchaseOrderService: PurchaseOrderService,
    private _storeService: StoreService,
    private _facilityService: FacilitiesService,
    // private _productService: ProductService,
    private _inventoryTransferService: InventoryTransferService,
    private _locker: CoolLocalStorage,
    private _employeeService: EmployeeService,
    private authFacadeService: AuthFacadeService
  ) {
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    const auth: any = this._locker.getObject('auth');
    // this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      this.checkingStore = this.loginEmployee.storeCheckIn.find(x => x.isOn === true);
      // if (this.checkingStore !== null) {
      //   this.getInventories();
      // }
      if ((this.loginEmployee.storeCheckIn === undefined
        || this.loginEmployee.storeCheckIn.length === 0)) {
        this.modal_on = true;
      } else {
        let isOn = false;
        this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
          if (itemr.isDefault === true) {
            itemr.isOn = true;
            itemr.lastLogin = new Date();
            isOn = true;
            let checkingObject = { typeObject: itemr, type: 'store' };
            this._employeeService.announceCheckIn(checkingObject);

            // tslint:disable-next-line:no-shadowed-variable
            this._employeeService.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn }).then(payload => {
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
              // tslint:disable-next-line:no-shadowed-variable
              this._employeeService.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn }).then(payload => {
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

    this._employeeService.checkInAnnounced$.subscribe(res => {
      if (!!res) {
        if (!!res.typeObject) {
          this.checkingStore = res.typeObject;
          if (!!this.checkingStore.storeId) {
            this.getInventories();
            this.getPurchaseOrders();
            this.getTransfers();
          }
        }
      }
    });
  }

  ngOnInit() {
  }

  getInventories() {
    if (!!this.checkingStore) {
      this._storeService.getStat({ facilityId: this.selectedFacility._id}, {
        query: { facilityId: this.selectedFacility._id, storeId: this.checkingStore.storeId,
          totalQuantity: { $gt: 1 }}
      }).then(res => {
        console.log(res);
        this.inventoryLoading = false;
        if (res.status === 'success') {
          this.inventoryCount = res.data.inventoryCount;
          this.inventories = res.data.inventories;
        }
      });
    }
  }

  getPurchaseOrders() {
    if (!!this.checkingStore) {
      this._purchaseOrderService.findOrder({
        query: { facilityId: this.selectedFacility._id, storeId: this.checkingStore.storeId, isActive: true }
      }).then(res => {
        console.log(res);
        this.purchaseOrderLoading = false;
        if (!!res.data && res.data.length > 0) {
          this.purchaseOrderCount = res.total;
          this.purchaseOrders = res.data;
        }
      });
    }
  }

  getTransfers() {
    if (!!this.checkingStore) {
      this._inventoryTransferService.findTransferHistories({
        query: { facilityId: this.selectedFacility._id, storeId: this.checkingStore.storeId, isActive: true }
      }).then(res => {
        console.log(res);
        this.transferLoading = false;
        if (!!res.data && res.data.length > 0) {
          this.transferCount = res.total;
          this.transfers = res.data;
        }
      });
    }
  }

  onChangeCheckedIn() {
    this.modal_on = true;
  }

  close_onClick(message: boolean): void {
    this.modal_on = false;
  }

  toggleQl() {
    this.Ql_toggle = !this.Ql_toggle;
  }

  ngOnDestroy() {
    if (this.loginEmployee.consultingRoomCheckIn !== undefined) {
      this.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
        if (itemr.isDefault === true && itemr.isOn === true) {
          itemr.isOn = false;
          this._employeeService.update(this.loginEmployee).then(payload => {
            this.loginEmployee = payload;
          });
        }
      });
    }
    this._employeeService.announceCheckIn(undefined);
    this._locker.setObject('checkingObject', {});
  }

}
