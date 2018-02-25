import { Component, OnInit } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { InventoryService, ProductService, EmployeeService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { Facility, Inventory, Employee, User } from '../../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
  adjustStock = false;
  showBatch = false;
  slideInventoryDetails = false;
  searchControl: FormControl = new FormControl();
  systemQuantity: FormControl = new FormControl();
  physicalQuantity: FormControl = new FormControl();
  comment: FormControl = new FormControl();

  inventories: any[] = [];

  selectedFacility: Facility = <Facility>{};
  selectedInventory: Inventory = <Inventory>{};
  user: User = <User>{};
  selectedTransaction: any = <any>{};
  loginEmployee: Employee = <Employee>{};
  selectedProduct: any = <any>{};
  checkingStore: any = <any>{};
  loading: boolean = true;

  constructor(
    private _inventoryEventEmitter: InventoryEmitterService,
    private _facilityService: FacilitiesService,
    private inventoryService: InventoryService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private locker: CoolLocalStorage,
    private authFacadeService: AuthFacadeService,
    private employeeService: EmployeeService,
    private systemModuleService: SystemModuleService
  ) {
    this.employeeService.checkInAnnounced$.subscribe(payload => {
      if (payload !== undefined) {
        if (payload.typeObject !== undefined) {
          this.checkingStore = payload.typeObject;
          if(this.checkingStore.storeId !== undefined){
            this.getInventories();
          }
        }
      }
    });
  }

  ngOnInit() {
    this._inventoryEventEmitter.setRouteUrl('Inventory Manager');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      this.checkingStore = this.loginEmployee.storeCheckIn.find(x => x.isOn === true);
      if (this.checkingStore !== null) {
        this.getInventories();
      }
    });
    const subscribeForCategory = this.searchControl.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: any[]) => this.inventoryService.find({
        query:
          { search: this.searchControl.value, facilityId: this.selectedFacility._id }
      }).
        then(payload => {
          this.loading = false;
          this.inventories = payload.data.filter(x => x.totalQuantity > 0);
          //this.inventories = payload.data;
        }));

    subscribeForCategory.subscribe((payload: any) => {
    });
  }

  getInventories() {
    if (this.checkingStore !== undefined) {
      this.inventoryService.findList({
        query:
          { facilityId: this.selectedFacility._id, name: '', storeId: this.checkingStore.storeId }//, $limit: 200 }
      })
        .then(payload => {
          this.loading = false;
          this.inventories = payload.data.filter(x => x.totalQuantity > 0);
        });
    }

  }
  onSelectProduct(product) {

  }
  slideInventoryDetailsToggle(value) {
    this.slideInventoryDetails = !this.slideInventoryDetails;
    if (value !== null && value !== undefined && value.productId !== undefined) {
      this.productService.get(value.productId, {}).subscribe(payload => {
        this.selectedProduct = payload;
      });
    }
  }
  onAdjustStock(inventory, transaction) {
    this.selectedInventory = inventory;
    this.selectedTransaction = transaction;
    this.systemQuantity.setValue(this.selectedTransaction.quantity);
    this.adjustStock = true;
  }
  closeAdjustStock() {
    this.adjustStock = false;
  }
  onShowBatch(inventory) {
    this.selectedInventory = inventory;
    this.selectedInventory.isOpen = !this.selectedInventory.isOpen;
  }
  auditProduct() {
    this.systemModuleService.on();
    if (this.selectedTransaction.adjustStocks === undefined) {
      this.selectedTransaction.adjustStocks = [];
    }
    this.selectedTransaction.adjustStocks.push(
      {
        systemQuantity: this.systemQuantity.value,
        physicalQuantity: this.physicalQuantity.value,
        comment: this.comment.value,
        adjustBy: this.loginEmployee._id,
        batchNumber: this.selectedTransaction.batchNumber
      }
    );
    this.selectedInventory.transactions.forEach((itemi, i) => {
      if (itemi._id === this.selectedTransaction._id) {
        itemi = this.selectedTransaction;
        itemi.quantity = this.physicalQuantity.value;
        itemi.availableQuantity = this.physicalQuantity.value;
      }
    });
    let difference = 0;
    if (this.systemQuantity.value > this.physicalQuantity.value) {
      difference = this.systemQuantity.value - this.physicalQuantity.value;
      this.selectedInventory.totalQuantity = this.selectedInventory.totalQuantity - difference;
    } else {
      difference = this.physicalQuantity.value - this.systemQuantity.value;
      this.selectedInventory.totalQuantity = this.selectedInventory.totalQuantity + difference;
    }

    this.inventoryService.update(this.selectedInventory).then(result => {
      this.systemModuleService.off();
      this.physicalQuantity.setValue(0);
      this.systemQuantity.setValue(0);
      this.comment.reset();
      this.closeAdjustStock();
      const message = 'Batch number "' + this.selectedTransaction.batchNumber + '" has been adjusted';
      this.systemModuleService.announceSweetProxy(message, 'success', null, null, null, null, null, null, null);
    });
  }

  // Notification
  private _notification(type: string, text: string): void {
    this._facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
