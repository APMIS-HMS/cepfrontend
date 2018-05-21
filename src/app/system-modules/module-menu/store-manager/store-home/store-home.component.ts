import { Subscription, ISubscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import {
  InventoryService, ProductService, EmployeeService, FacilitiesService,
  StoreService, PurchaseOrderService, InventoryTransferService,InventoryTransferStatusService
} from '../../../../services/facility-manager/setup/index';
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
  completedInventoryStatus: any = <any>{};
  rejectedInventoryStatus: any = <any>{};
  transferStatuses: any[] = [];
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
  isRunningQuery = false;

  subscription: ISubscription;

  constructor(
    private _inventoryService: InventoryService,
    private _purchaseOrderService: PurchaseOrderService,
    private _storeService: StoreService,
    private _facilityService: FacilitiesService,
    // private _productService: ProductService,
    private _inventoryTransferService: InventoryTransferService,
    private _locker: CoolLocalStorage,
    private _employeeService: EmployeeService,
    private authFacadeService: AuthFacadeService,
    private inventoryTransferStatusService: InventoryTransferStatusService
  ) {
    this.getTransferStatus();
    this.subscription = this._employeeService.checkInAnnounced$.subscribe(res => {
      if (!!res) {
        if (!!res.typeObject) {
          this.checkingStore = res.typeObject;
          if (!!this.checkingStore.storeId) {
            if (!this.isRunningQuery) {
              this.inventoryLoading = true;
              this.purchaseOrderLoading = true;
              this.transferLoading = true;
              this.inventories = [];
              this.transfers = [];
              this.purchaseOrders = [];
              this.isRunningQuery = true;
              this.getInventories();
              this.getPurchaseOrders();
              this.getTransfers();
            }
          }
        }
      }
    });
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
            // this._employeeService.announceCheckIn(checkingObject);

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


  }

  ngOnInit() {
    
  }

  getInventories() {
    if (!!this.checkingStore) {
      this._inventoryService.find({
        query: {
          facilityId: this.selectedFacility._id,
          storeId: this.checkingStore.storeId,
          availableQuantity: { $gt: 0 }
        }
      }).then(res => {
        console.log(res);
        this.inventoryLoading = false;
        this.inventoryCount = res.total;
        this.inventories = res.data;
        this.isRunningQuery = false;
      });
    }
  }

  getPurchaseOrders() {
    if (!!this.checkingStore) {
      this._purchaseOrderService.find({
        query: { facilityId: this.selectedFacility._id, storeId: this.checkingStore.storeId, isActive: true }
      }).then(res => {
        this.purchaseOrderLoading = false;
        if (!!res.data && res.data.length > 0) {
          this.purchaseOrderCount = res.total;
          this.purchaseOrders = res.data;
        }
      }).catch(err => {
      });
    }
  }

  getTransfers() {
    console.log(this.checkingStore.storeId);
    console.log(this.selectedFacility._id);
    if (!!this.checkingStore) {
      this._inventoryTransferService.find({
        query: { facilityId: this.selectedFacility._id, storeId: this.checkingStore.storeId,$sort: { createdAt: -1 }  }
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

  getTransferStatus() {
    this.inventoryTransferStatusService.findAll().subscribe(payload => {
      this.transferStatuses = payload.data;
      this.transferStatuses.forEach((item, i) => {
        if (item.name === 'Completed') {
          this.completedInventoryStatus = item;
        }
        if (item.name === 'Rejected') {
          this.rejectedInventoryStatus = item;
        }
      });
    });
  }

  getStatus(transaction) {
    const receivedTransactions = transaction.inventoryTransferTransactions
      .filter(item => item.transferStatusId === this.completedInventoryStatus._id);
    if (receivedTransactions.length === transaction.inventoryTransferTransactions.length) {
      return this.completedInventoryStatus.name;
    }

    const rejectedTransactions = transaction.inventoryTransferTransactions
      .filter(item => item.transferStatusId === this.rejectedInventoryStatus._id);
    if (rejectedTransactions.length === transaction.inventoryTransferTransactions.length) {
      return this.rejectedInventoryStatus.name;
    }
    return 'Pending';
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
    this.subscription.unsubscribe();
  }

}
