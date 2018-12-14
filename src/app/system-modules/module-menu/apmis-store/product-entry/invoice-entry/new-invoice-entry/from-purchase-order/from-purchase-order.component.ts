import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-from-purchase-order',
  templateUrl: './from-purchase-order.component.html',
  styleUrls: ['./from-purchase-order.component.scss']
})
export class FromPurchaseOrderComponent implements OnInit {

  searchSuplier: FormControl = new FormControl();
  purchaseOrderFormControl: FormControl = new FormControl();
  invoiceDate: FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

}
