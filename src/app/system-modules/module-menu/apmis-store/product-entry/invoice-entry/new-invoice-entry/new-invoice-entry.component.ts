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
  
	supplierFormControl: FormControl = new FormControl();
	purchaseOrderFormControl: FormControl = new FormControl();
	invoiceNo: FormControl = new FormControl();
	invoiceAmount: FormControl = new FormControl();
	discount: FormControl = new FormControl();
	vat: FormControl = new FormControl();
	remark: FormControl = new FormControl();
	currentDate: FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

}
