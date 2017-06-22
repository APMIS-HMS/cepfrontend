import { Component, OnInit } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
// tslint:disable-next-line:max-line-length
import { InventoryService, InventoryTransferService, InventoryTransferStatusService, InventoryTransactionTypeService, StoreService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
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

  selectedFacility: Facility = <Facility>{};
  selectedInventoryTransfer: InventoryTransfer = <InventoryTransfer>{};
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
    private locker: CoolLocalStorage
  ) { }

  ngOnInit() {
    this._inventoryEventEmitter.setRouteUrl('Receive Stock');
    this.selectedFacility =  <Facility> this.locker.getObject('selectedFacility');
    this.checkingStore = this.locker.getObject('checkingObject');

    this.route.data.subscribe(data => {
      data['loginEmployee'].subscribe((payload) => {
        this.loginEmployee = payload.loginEmployee;
      });
    });
    this.getTransfers();
    this.getTransferStatus();
  }
  getTransfers() {
    this.inventoryTransferService.find({
      query: {
        facilityId: this.selectedFacility._id,
        destinationStoreId: this.checkingStore.typeObject.storeId,
        $limit: 200
      }
    }).then(payload => {
      console.log(payload);
      this.receivedTransfers = payload.data;
    });
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
    if (reload === true) {
      this.inventoryTransferService.get(receive._id, {}).subscribe(payload => {
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
    }


  }
  onValueChanged(event, transaction) {
    transaction.checked = event.value;
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
        console.log(i);
      }
    });
    this.inventoryTransferService.update(this.selectedInventoryTransfer).subscribe(payload => {
      this.slideDetailsShow(payload, false);
    });

  }

  reject() {
    this.selectedInventoryTransfer.inventoryTransferTransactions.forEach((item: any, i) => {
      if (item.checked !== undefined && item.checked === true && !(item.transferStatusId === this.completedInventoryStatus._id) ||
        (item.transferStatusId === this.rejectedInventoryStatus._id)) {
        item.transferStatusId = this.rejectedInventoryStatus._id;
      }
    });
    this.inventoryTransferService.update(this.selectedInventoryTransfer).then(payload => {
      this.slideDetailsShow(payload, false);
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
}
