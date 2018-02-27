import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreEmitterService } from '../../../../services/facility-manager/store-emitter.service';
import { SupplierService } from '../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ProductEmitterService } from '../../../../services/facility-manager/product-emitter.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-supplier-manager',
  templateUrl: './supplier-manager.component.html',
  styleUrls: ['./supplier-manager.component.scss']
})
export class SupplierManagerComponent implements OnInit {
  newSupply = false;
  selectedFacility: any = <any>{};
  selectedSupplier: any = <any>{};
  searchControl = new FormControl();
  suppliers: any[] = [];
  constructor(private router: Router,
    private _productEventEmitter: ProductEmitterService,
    private _systemModuleService: SystemModuleService,
    private supplierService: SupplierService,
    private locker: CoolLocalStorage) {

  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this._productEventEmitter.setRouteUrl('Supplier Manager');
    this.getSuppliers();
    this.searchControl.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(item => {
        this.supplierService.find({
          query: {
            facilityId: this.selectedFacility._id,
            name: {
              $regex: this.searchControl.value,
              '$options': 'i'
            }
          }
        }).then(payload => {
          this.suppliers = payload.data;
        })
      });
  }
  getSuppliers() {
    this.supplierService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.suppliers = payload.data;
    }, error => {
    });
  }
  onSelect(supplier) {
    this.router.navigate(['/dashboard/product-manager/supplier-detail', supplier._id]);
  }
  onEdit(supplier) {
    this.selectedSupplier = supplier;
    this._systemModuleService.announceSweetProxy('You are about to edit this supplier', 'question', this);
  }

  onDelete(supplier) {
    this.selectedSupplier = supplier;
    this.selectedSupplier.isDelete = true;
    this._systemModuleService.announceSweetProxy('You are about to delete this supplier', 'question', this);
  }

  sweetAlertCallback(result) {
    if (result.value) {
      if (this.selectedSupplier.isDelete) {
        this._systemModuleService.off();
        this.supplierService.remove(this.selectedSupplier._id, {}).then(callback_remove => {
          this._systemModuleService.announceSweetProxy(this.selectedSupplier.name + ' is deleted', 'success', null, null, null, null, null, null, null);
          this._systemModuleService.off();
          this.selectedSupplier = <any>{};
          this.getSuppliers();
        }, error => {
          this._systemModuleService.off();
        });
      } else {
        this.newSupply = true;
      }
    }
  }

  close_onClick(message: boolean): void {
    this.selectedSupplier = <any>{};
    this.newSupply = false;
  }
  newSupplyShow() {
    this.newSupply = true;
  }
  onRefreshSupplier(value) {
    this.getSuppliers();
  }
  refresh(): void {
    // window.location.reload();
  }
}
