import { SystemModuleService } from './../../../../services/module-manager/setup/system-module.service';
import { Component, OnInit } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
// tslint:disable-next-line:max-line-length
import { InventoryService, InventoryTransferService, InventoryTransferStatusService, InventoryTransactionTypeService, StoreService, EmployeeService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
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
  loading = true;
  trdropDown = false;
  histories: any[] = [];
  historyDetailsToggle = false;
  selectedProduct: any = <any>{};
  resendButton = 'Resend';
  searchOpen = false;
  stores: any[] = <any>[];

  selectedFacility: Facility = <Facility>{};
  selectedInventoryTransfer: InventoryTransfer = <InventoryTransfer>{};
  checkingStore: any = <any>{};
  searchControl = new FormControl();
  frmStore = new FormControl();
  constructor(
    private _inventoryEventEmitter: InventoryEmitterService,
    private inventoryService: InventoryService, private inventoryTransferService: InventoryTransferService,
    private inventoryTransactionTypeService: InventoryTransactionTypeService,
    private inventoryTransferStatusService: InventoryTransferStatusService, private employeeService: EmployeeService,
    private locker: CoolLocalStorage, private systemModuleService: SystemModuleService,
    private storeService: StoreService,
    private authFacadeService: AuthFacadeService
  ) {
    this.employeeService.checkInAnnounced$.subscribe(payload => {
      if (payload !== undefined) {
        this.checkingStore = payload;
        // this.getTransfers();
      }
    });
  }

  ngOnInit() {
    this._inventoryEventEmitter.setRouteUrl('Stock History');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.checkingStore = payload.storeCheckIn.find(x => x.isOn === true);
      this.getTransfers();
      this.getStores();
    });
    

    this.frmStore.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        this.loading = true;
        this.systemModuleService.on();
        this.inventoryTransferService.find({
          query: {
            facilityId: this.selectedFacility._id,
            destinationStoreId: value
          }
        }).then(payload => {
          this.loading = false;
          this.systemModuleService.off();
          this.transferHistories = payload.data;
        }, error => {
          this.loading = false;
          this.systemModuleService.off();
        });
      });


    this.searchControl.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        this.systemModuleService.on();
        this.inventoryTransferService.findTransferHistories({
          query: {
            facilityId: this.selectedFacility._id,
            storeId: this.checkingStore.typeObject.typeObject.storeId,
            name: value
          }
        }).then(payload => {
          this.systemModuleService.off();
          this.transferHistories = payload.data;
        }, error => {
          this.systemModuleService.off();
        });
      });
  }

  getTransfers() {
    this.loading = true;
    this.systemModuleService.on();
    this.inventoryTransferService.find({
      query: {
        facilityId: this.selectedFacility._id,
        storeId: this.checkingStore.storeId,
        $sort: { createdAt: -1 }
      }
    }).then(payload => {
      this.loading = false;
      this.systemModuleService.off();
      this.transferHistories = payload.data;
    }, error => {
      this.loading = false;
      this.systemModuleService.off();
    });
  }

  getStores() {
    this.loading = true;
    this.systemModuleService.on();
    this.storeService.find({
      query: {
        facilityId: this.selectedFacility._id,
        _id: { $ne: this.checkingStore.storeId }
      }
    }).then(payload => {
      this.loading = false;
      this.systemModuleService.off();
      if (payload.data !== undefined) {
        this.stores = payload.data;
      }
    }, error => {
      this.loading = false;
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

  openSearch() {
    this.searchOpen = !this.searchOpen;
  }

}
