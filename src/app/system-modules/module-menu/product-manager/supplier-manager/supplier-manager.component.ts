import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreEmitterService } from '../../../../services/facility-manager/store-emitter.service';
import { SupplierService } from '../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ProductEmitterService } from '../../../../services/facility-manager/product-emitter.service';

@Component({
  selector: 'app-supplier-manager',
  templateUrl: './supplier-manager.component.html',
  styleUrls: ['./supplier-manager.component.scss']
})
export class SupplierManagerComponent implements OnInit {
  newSupply = false;
  selectedFacility: Facility = <Facility>{};
  selectedSupplier: any = <any>{};

  suppliers: any[] = [];
  constructor(private router: Router, private _productEventEmitter: ProductEmitterService,
    private supplierService: SupplierService, private locker: CoolLocalStorage) {
    this.supplierService.listenerCreate.subscribe(payload => {
      this.getSuppliers();
    });
    this.supplierService.listenerDelete.subscribe(payload => {
      this.getSuppliers();
    });
    this.supplierService.listenerUpdate.subscribe(payload => {
      this.getSuppliers();
    });

  }

  ngOnInit() {
    this.selectedFacility =  <Facility> this.locker.getObject('selectedFacility');
    this._productEventEmitter.setRouteUrl('Supplier Manager');
    this.getSuppliers();
  }
  getSuppliers() {
    this.supplierService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.suppliers = payload.data;
      console.log(payload);
    }, error => {
      console.log(error);
    });
  }
  onSelect(supplier) {
    this.router.navigate(['/dashboard/product-manager/supplier-detail', supplier._id]);
  }
  onEdit(supplier) {
    this.selectedSupplier = supplier;
    this.newSupply = true;
  }
  close_onClick(message: boolean): void {
    this.selectedSupplier = <any>{};
    this.newSupply = false;
  }
  newSupplyShow() {
    this.newSupply = true;
  }
  refresh(): void {
    window.location.reload();
}
}
