import { Component, OnInit } from '@angular/core';
import { PurchaseEmitterService } from '../../../../services/facility-manager/purchase-emitter.service';
import { PurchaseEntryService, EmployeeService, SupplierService } from '../../../../services/facility-manager/setup/index';
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

  invoices: any[] = [];
  suppliers: any[] = [];
  selectedFacility: Facility = <Facility>{};
  selectedProduct: any = <any>{};
  checkingStore: any = <any>{};
  loginEmployee: Employee = <Employee>{};
  constructor(
    private _purchaseEventEmitter: PurchaseEmitterService,
    private locker: CoolLocalStorage,
    private invoiceService: PurchaseEntryService,
    private employeeService: EmployeeService,
    private supplierService: SupplierService,
    private router: Router,
    private authFacadeService: AuthFacadeService,
    private route: ActivatedRoute
  ) {
    this.employeeService.checkInAnnounced$.subscribe(payload => {
      if (payload !== undefined) {
        this.checkingStore = payload;
        if (payload.typeObject !== undefined) {
          this.checkingStore = payload.typeObject;
        }
        this.getInvoices();
      }
    });
  }

  ngOnInit() {
    this._purchaseEventEmitter.setRouteUrl('Purchase Invoices');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.checkingStore = payload.storeCheckIn.find(x => x.isOn == true);
      this.getInvoices();
      this.getSuppliers();
    });

    this.frmSupplier.valueChanges.subscribe(value => {
      if (value !== null) {
        this.invoiceService.find({ query: { supplierId: value } }).subscribe(payload => {
          this.invoices = payload.data;
        });
      } else {
        this.getInvoices();
      }

    });
  }
  getSuppliers() {
    this.supplierService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(payload => {
      this.suppliers = payload.data;
    });
  }
  getInvoices() {
    if (this.checkingStore !== null) {
      this.invoiceService.findInvoices({
        query: {
          facilityId: this.selectedFacility._id,
          storeId: this.checkingStore.storeId, $limit: 100
        }
      }).then(payload => {
        this.invoices = payload.data;
      });
    }
  }
  slideInvoiceDetailsToggle(value, event) {
    this.selectedProduct = value;
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

}
