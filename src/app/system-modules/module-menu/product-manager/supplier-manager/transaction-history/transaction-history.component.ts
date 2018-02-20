import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService, PurchaseEntryService } from '../../../../../services/facility-manager/setup/index';
import { Facility, PurchaseEntry } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {
  suppliers: string[];
  newPayment = false;
  paymentHistory = false;
  invoices = [];
  selected_supplier = "";

  frmFilterSupplier: FormControl = new FormControl();

  selectedFacility: Facility = <Facility>{};
  selectedInvoice: PurchaseEntry = <PurchaseEntry>{};
  constructor(private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private invoiceService: PurchaseEntryService,
    private locker: CoolLocalStorage) {
  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getHistory();
    this.getSuppliers();
    this.frmFilterSupplier.valueChanges.subscribe(payload => {
      this.router.navigate(['/dashboard/product-manager/supplier-details', payload]);
    });
  }

  getHistory(){
    this.route.params.subscribe(params => {
      let id = params['id'];
      if (id !== undefined) {
        this.invoiceService.getInvoice(id, { query: { supplierId: id, facilityId: this.selectedFacility._id } }).subscribe(value => {
          console.log(value);
          this.invoices = value;
          this.selected_supplier = value.supplier;
        }, error => {
          console.log(error);
        });
      }
    });
  }

  getSuppliers() {
    this.supplierService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.suppliers = payload.data;
    });
  }
  close_onClick(message: boolean): void {
    this.newPayment = false;
  }
  closeHistory_onClick(message: boolean): void {
    this.paymentHistory = false;
  }
  newPaymentShow() {
    this.newPayment = true;
  }
  PaymentHistoryShow(invoice) {
    this.selectedInvoice = invoice;
    this.paymentHistory = !this.paymentHistory;
  }

  onRefreshHistory(value){
    this.getHistory();
  }
}