import { SystemModuleService } from './../../../../services/module-manager/setup/system-module.service';
import { Component, OnInit } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
// tslint:disable-next-line:max-line-length
import {
  InventoryService, InventoryTransferService, InventoryTransferStatusService, InventoryTransactionTypeService,
  StoreService, FacilitiesService, EmployeeService
} from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import {
  Facility, InventoryTransferStatus, InventoryTransactionType, InventoryTransferTransaction,
  InventoryTransfer, Employee
} from '../../../../models/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-receive-stock',
  templateUrl: './receive-stock.component.html',
  styleUrls: ['./receive-stock.component.scss']
})
export class ReceiveStockComponent implements OnInit {
  slideDetails = false;
  clickslide = false;
  user: any = <any>{};
  selectedFacility: Facility = <Facility>{};
  selectedInventoryTransfer: any = <any>{};
  checkingStore: any = <any>{};
  loginEmployee: Employee = <Employee>{};
  receivedTransfers: InventoryTransfer[] = [];
  transferStatuses: InventoryTransferStatus[] = [];
  completedInventoryStatus: InventoryTransferStatus = <InventoryTransferStatus>{};
  rejectedInventoryStatus: InventoryTransferStatus = <InventoryTransferStatus>{};
  constructor(
    private _inventoryEventEmitter: InventoryEmitterService,
    private inventoryService: InventoryService, private inventoryTransferService: InventoryTransferService,
    private inventoryTransactionTypeService: InventoryTransactionTypeService,
    private inventoryTransferStatusService: InventoryTransferStatusService, private route: ActivatedRoute,
    private locker: CoolLocalStorage, private facilityService: FacilitiesService, private employeeService: EmployeeService,
    private systemModuleService: SystemModuleService,
    private authFacadeService: AuthFacadeService
  ) {
    this.employeeService.checkInAnnounced$.subscribe(payload => {
      console.log(payload);
      if (payload.typeObject !== undefined) {
        this.checkingStore = payload.typeObject;
        this.getTransfers();
      }
    });
  }

  ngOnInit() {
    this.user = this.locker.getObject('auth');
    this._inventoryEventEmitter.setRouteUrl('Receive Stock');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      this.checkingStore = this.loginEmployee.storeCheckIn.find(x => x.isOn == true);
      console.log(this.checkingStore);
      this.route.data.subscribe(data => {
        data['loginEmployee'].subscribe((payload) => {
          this.loginEmployee = payload.loginEmployee;
        });
      });
      this.getTransfers();
      this.getTransferStatus();
    });

  }
  getTransfers() {
    if (this.checkingStore !== undefined) {
      this.systemModuleService.on();
      this.inventoryTransferService.findTransferHistories({
        query: {
          facilityId: this.selectedFacility._id,
          destinationStoreId: this.checkingStore.storeId,
          limit: 200
        }
      }).then(payload => {
        this.systemModuleService.off();
        this.receivedTransfers = payload.data;
      }, error => {
        this.systemModuleService.off();
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
  clicked() {
    this.slideDetails = false;
    this.clickslide = false;
  }
  slideDetailsShow(receive, reload = true) {
    this.systemModuleService.on();
    if (reload === true) {
      console.log("Am in slider");
      this.inventoryTransferService.getItemDetails(receive._id, {}).subscribe(payload => {
        console.log(payload);
        if (payload.storeId != undefined) {
          const that = this;
          this.selectedInventoryTransfer = payload;
          this.selectedInventoryTransfer.inventoryTransferTransactions.forEach(function (itemi: any) {
            itemi.checked = false;
            if (itemi.transferStatusId === that.completedInventoryStatus._id) {
              itemi.checked = true;
            } else if (itemi.transferStatusId === that.rejectedInventoryStatus._id) {
              itemi.checked = undefined;
            }
          });
          this.slideDetails = !this.slideDetails;
          this.systemModuleService.off();
        }
      });
    } else {
      this.selectedInventoryTransfer = receive;
      const that = this;
      this.selectedInventoryTransfer.inventoryTransferTransactions.forEach(function (itemi: any) {
        itemi.checked = false;
        if (itemi.transferStatusId === that.completedInventoryStatus._id) {
          itemi.checked = true;
        } else if (itemi.transferStatusId === that.rejectedInventoryStatus._id) {
          itemi.checked = undefined;
        }
      });
      this.slideDetails = !this.slideDetails;
      this.systemModuleService.off();
    }


  }
  onValueChanged(event, transaction) {
    transaction.checked = event.checked;
  }
  shouldDisabled(transaction) {
    return transaction.transferStatusId === this.completedInventoryStatus._id ||
      transaction.transferStatusId === this.rejectedInventoryStatus._id;
  }
  accept() {
    this.selectedInventoryTransfer.inventoryTransferTransactions.forEach((item: any, i) => {
      if (item.checked !== undefined && item.checked === true && !(item.transferStatusId === this.completedInventoryStatus._id) ||
        (item.transferStatusId === this.rejectedInventoryStatus._id)) {
        item.transferStatusId = this.completedInventoryStatus._id;
      }
    });
    this.inventoryTransferService.patch(this.selectedInventoryTransfer._id, { inventoryTransferTransactions: this.selectedInventoryTransfer.inventoryTransferTransactions }).then(payload => {
      this.slideDetailsShow(payload.inventoryTransfers, false);
      this.getTransfers();
      this.systemModuleService.announceSweetProxy('Stock tran successfully', 'success');
    }, error => {
      this._notification("Error", "Failed to accept stock, please try again");
    });

  }

  reject() {
    this.selectedInventoryTransfer.inventoryTransferTransactions.forEach((item: any, i) => {
      if (item.checked !== undefined && item.checked === true && !(item.transferStatusId === this.completedInventoryStatus._id) ||
        (item.transferStatusId === this.rejectedInventoryStatus._id)) {
        item.transferStatusId = this.rejectedInventoryStatus._id;
      }
    });
    this.inventoryTransferService.patch(this.selectedInventoryTransfer._id, { inventoryTransferTransactions: this.selectedInventoryTransfer.inventoryTransferTransactions }).then(payload => {
      this.slideDetailsShow(payload.inventoryTransfers, false);
    });
  }
  getStatus(transaction) {
    const receivedTransactions = transaction.inventoryTransferTransactions.filter(item => item.transferStatusId === this.completedInventoryStatus._id);
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

  private _notification(type: String, text: String): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
