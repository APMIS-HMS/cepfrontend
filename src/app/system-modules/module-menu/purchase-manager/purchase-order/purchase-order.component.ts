import { Component, OnInit, EventEmitter } from '@angular/core';
import { SupplierService, ProductService, PurchaseOrderService, StoreService } from '../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { PurchaseOrder } from '../../../../models/index';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PurchaseEmitterService } from '../../../../services/facility-manager/purchase-emitter.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
  slidePurchaseDetails = false;
  frmSupplier: FormControl = new FormControl();

  orders: any[] = [];
  suppliers: any[] = [];

  selectedFacility: Facility = <Facility>{};
  selectedOrder: any = <any>{};
  constructor(
    private supplierService: SupplierService, private router: Router,
    private storeService: StoreService, private locker: CoolSessionStorage, private productService: ProductService,
    private purchaseOrderService: PurchaseOrderService,
    private _purchaseEventEmitter: PurchaseEmitterService) { }

  ngOnInit() {
    this._purchaseEventEmitter.setRouteUrl('Purchase Orders');
    this.selectedFacility =  <Facility> this.locker.getObject('selectedFacility');
    this.getPurchaseOrders();
    this.getSuppliers();

    this.frmSupplier.valueChanges.subscribe(value => {
      if (value !== null) {
        this.purchaseOrderService.find({ query: { supplierId: value } }).subscribe(payload => {
          this.orders = payload.data;
        });
      } else {
        this.getPurchaseOrders();
      }

    });
  }
  getSuppliers() {
    this.supplierService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(payload => {
      this.suppliers = payload.data;
    });
  }
  getPurchaseOrders() {
    this.purchaseOrderService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(payload => {
      this.orders = payload.data;
    });
  }
  slidePurchaseDetailsToggle(value, event) {
    this.selectedOrder = value;
    this.slidePurchaseDetails = !this.slidePurchaseDetails;
  }

  onNavigateToDetail(value) {
    this.router.navigate(['/dashboard/purchase-manager/order-details', value._id]);
  }
  onNavigateToAddStore(value) {
    this.router.navigate(['/dashboard/purchase-manager/purchase-entry', value._id]);
  }
}
