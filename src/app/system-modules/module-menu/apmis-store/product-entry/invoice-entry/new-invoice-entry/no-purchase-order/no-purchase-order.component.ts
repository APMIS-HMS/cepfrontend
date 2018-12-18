import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-no-purchase-order',
  templateUrl: './no-purchase-order.component.html',
  styleUrls: ['./no-purchase-order.component.scss']
})
export class NoPurchaseOrderComponent implements OnInit {

  searchSuplier: FormControl = new FormControl();
  purchaseOrderFormControl: FormControl = new FormControl();
  invoiceDate: FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

}
