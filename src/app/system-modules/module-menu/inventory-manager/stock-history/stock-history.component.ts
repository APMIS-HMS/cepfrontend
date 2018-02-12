import { SystemModuleService } from './../../../../services/module-manager/setup/system-module.service';
import { Component, OnInit } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
// tslint:disable-next-line:max-line-length
import { InventoryService, InventoryTransferService, InventoryTransferStatusService, InventoryTransactionTypeService, StoreService, EmployeeService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
  Facility, InventoryTransferStatus, InventoryTransactionType, InventoryTransferTransaction,
  InventoryTransfer, Employee
} from '../../../../models/index';
@Component({
  selector: 'app-stock-history',
  templateUrl: './stock-history.component.html',
  styleUrls: ['./stock-history.component.scss']
})


export class StockHistoryComponent implements OnInit {

  transferHistories = [
    { transfer: '234sportmedia', value: 400, date: '23-1-2001', id: 'apmis-23401' },
  ];

  showDetails = false;

  trdropDown = false;

  histories: any[] = [];
  historyDetailsToggle = false;
  selectedProduct: any = <any>{};
  resendButton = 'Resend';

  selectedFacility: Facility = <Facility>{};
  selectedInventoryTransfer: InventoryTransfer = <InventoryTransfer>{};
  checkingStore: any = <any>{};
  constructor(
    private _inventoryEventEmitter: InventoryEmitterService,
    private inventoryService: InventoryService, private inventoryTransferService: InventoryTransferService,
    private inventoryTransactionTypeService: InventoryTransactionTypeService,
    private inventoryTransferStatusService: InventoryTransferStatusService, private employeeService: EmployeeService,
    private locker: CoolLocalStorage, private systemModuleService: SystemModuleService
  ) {
    this.employeeService.checkInAnnounced$.subscribe(payload => {
      console.log(payload);
      if (payload != undefined) {
        this.checkingStore = payload;
        this.getTransfers();
      }
    });
  }

  ngOnInit() {
    this._inventoryEventEmitter.setRouteUrl('Stock History');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.checkingStore = this.locker.getObject('checkingObject');
    this.getTransfers();
  }
  getTransfers() {
    this.systemModuleService.on();
    console.log(this.checkingStore.typeObject.storeId);
    this.inventoryTransferService.findTransferHistories({
      query: {
        facilityId: this.selectedFacility._id,
        storeId: this.checkingStore.typeObject.storeId,
        limit: 200
      }
    }).then(payload => {
      this.systemModuleService.off();
      if (payload.data != undefined) {
        this.transferHistories = payload.data;
        console.log(this.transferHistories);
      }
    }, error => {
      console.log(error);
      this.systemModuleService.off();
    });
  }
  onClickViewHistoryDetails(value, event) {
    this.historyDetailsToggle = !this.historyDetailsToggle;
  }
  trCollapse() {
    this.trdropDown = !this.trdropDown;
  }
  onShowBatch(transfer) {
    this.selectedInventoryTransfer = transfer;
    this.selectedInventoryTransfer.isOpen = !this.selectedInventoryTransfer.isOpen;
  }

}
