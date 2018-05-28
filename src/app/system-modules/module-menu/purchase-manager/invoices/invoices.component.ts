import { Component, OnInit } from '@angular/core';
import { PurchaseEmitterService } from '../../../../services/facility-manager/purchase-emitter.service';
import { PurchaseEntryService, EmployeeService, SupplierService } from '../../../../services/facility-manager/setup/index';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, Employee } from '../../../../models/index';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  slideInvoiceDetails = false;
  frmSupplier: FormControl = new FormControl();
  searchOpen = false;

  invoices: any[] = [];
  suppliers: any[] = [];
  selectedFacility: Facility = <Facility>{};
  selectedProduct: any = <any>{};
  checkingStore: any = <any>{};
  subscription: any = <any>{};
  loginEmployee: Employee = <Employee>{};
  constructor(
    private _purchaseEventEmitter: PurchaseEmitterService,
    private locker: CoolLocalStorage,
    private invoiceService: PurchaseEntryService,
    private employeeService: EmployeeService,
    private supplierService: SupplierService,
    private router: Router,
    private authFacadeService: AuthFacadeService,
    private route: ActivatedRoute,
    private systemModuleService: SystemModuleService
  ) {
    this.subscription = this.employeeService.checkInAnnounced$.subscribe(res => {
      if (!!res) {
        if (!!res.typeObject) {
          this.checkingStore = res.typeObject;
          if (!!this.checkingStore.storeId) {
            this.getInvoices();
          }
        }
      }
    });
  }

  ngOnInit() {
    this._purchaseEventEmitter.setRouteUrl('Purchase Invoices');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.checkingStore = payload;
      this.checkingStore = payload.storeCheckIn.find(x => x.isOn === true);
      this.getInvoices();
      this.getSuppliers();
    });

    this.frmSupplier.valueChanges.subscribe(value => {
      if (value !== null) {
        this.invoiceService.find({ query: { supplierId: value } }).subscribe(payload => {
          this.invoices = payload.data;
        });
      }
    });
  }
  getSuppliers() {
    this.systemModuleService.on();
    this.supplierService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(payload => {
      this.suppliers = payload.data;
      this.systemModuleService.off();
    });
  }
  getInvoices() {
    this.systemModuleService.on();
    if (this.checkingStore !== null) {
      this.invoiceService.find({
        query: {
          facilityId: this.selectedFacility._id,
          storeId: this.checkingStore.storeId,
          $sort: { createdAt: -1 }
        }
      }).then(payload => {
        this.invoices = payload.data;
        this.systemModuleService.off();
      }, error => {

      });
    }
  }
  slideInvoiceDetailsToggle(value, event) {
    this.selectedProduct = value;
    console.log(this.selectedProduct);
    if (this.selectedProduct !== undefined) {
      this.invoiceService.get(this.selectedProduct._id, {}).then(payload => {
      });
    }

    this.slideInvoiceDetails = !this.slideInvoiceDetails;
  }
  onNavigateToPayment(value) {
    this.router.navigate(['/dashboard/product-manager/supplier-detail', value.supplierId]);
  }

  onEditInvoice(invoice) {
    this.router.navigate(['/dashboard/purchase-manager/purchase-entry-edit', invoice._id]);
  }

  ngOnDestroy() {
    if (this.loginEmployee.consultingRoomCheckIn !== undefined) {
      this.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
        if (itemr.isDefault === true && itemr.isOn === true) {
          itemr.isOn = false;
          this.employeeService.update(this.loginEmployee).then(payload => {
            this.loginEmployee = payload;
          });
        }
      });
    }
    this.employeeService.announceCheckIn(undefined);
    this.locker.setObject('checkingObject', {});
    this.subscription.unsubscribe();
  }

  openSearch() {
    this.searchOpen = !this.searchOpen;
  }
}
