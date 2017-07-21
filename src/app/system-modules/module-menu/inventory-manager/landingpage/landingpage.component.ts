import { Component, OnInit } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { InventoryService, ProductService } from '../../../../services/facility-manager/setup/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Facility, Inventory, Employee } from '../../../../models/index';
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
  selectedTransaction: any = <any>{};
  loginEmployee: Employee = <Employee>{};
  selectedProduct: any = <any>{};
  checkingStore: any = <any>{};
  constructor(
    private _inventoryEventEmitter: InventoryEmitterService,
    private inventoryService: InventoryService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private locker: CoolSessionStorage
  ) { }

  ngOnInit() {
    this._inventoryEventEmitter.setRouteUrl('Inventory Manager');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.checkingStore = this.locker.getObject('checkingObject');
    this.route.data.subscribe(data => {
      data['loginEmployee'].subscribe((payload) => {
        this.loginEmployee = payload.loginEmployee;
      });
    });

    this.inventoryService.find({
      query:
      { facilityId: this.selectedFacility._id, storeId: this.checkingStore.typeObject.storeId, $limit: 200 }
    })
      .subscribe(payload => {
        this.inventories = payload.data;
        console.log(this.inventories);
      });

    const subscribeForCategory = this.searchControl.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: any[]) => this.inventoryService.find({
        query:
        { search: this.searchControl.value, facilityId: this.selectedFacility._id }
      }).
        then(payload => {
          this.inventories = payload.data;
        }));

    subscribeForCategory.subscribe((payload: any) => {
    });
  }

  onSelectProduct(product) {

  }
  slideInventoryDetailsToggle(value) {
    this.slideInventoryDetails = !this.slideInventoryDetails;
    if (value !== null && value !== undefined && value.productId !== undefined) {
      this.productService.get(value.productId, {}).subscribe(payload => {
        this.selectedProduct = payload;
        console.log(payload);
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

    this.inventoryService.update(this.selectedInventory).subscribe(result => {
      this.physicalQuantity.setValue(0);
      this.systemQuantity.setValue(0);
      this.comment.reset();
      this.closeAdjustStock();
    });
  }
}
