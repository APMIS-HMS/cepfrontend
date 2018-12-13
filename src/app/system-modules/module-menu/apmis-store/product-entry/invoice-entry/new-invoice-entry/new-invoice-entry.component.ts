import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-new-invoice-entry',
  templateUrl: './new-invoice-entry.component.html',
  styleUrls: ['./new-invoice-entry.component.scss']
})
export class NewInvoiceEntryComponent implements OnInit {

  productConfigSearch: FormControl = new FormControl();
  purchaseListFormControl: FormControl = new FormControl();
  switchView = true;


  invoiceNo: FormControl = new FormControl();
  invoiceAmount: FormControl = new FormControl();
  discount: FormControl = new FormControl();
  vat: FormControl = new FormControl();
  remark: FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

  switcher1_click() {
    this.switchView = true;
  }
  switcher2_click() {
    this.switchView = false;
  }

}
