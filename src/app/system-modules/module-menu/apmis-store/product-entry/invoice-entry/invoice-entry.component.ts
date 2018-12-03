import {  Component, EventEmitter, OnInit, Output  } from '@angular/core';
import { StoreGlobalUtilService } from '../../store-utils/global-service';
import { Filters } from '../../store-utils/global';

@Component({
  selector: 'app-invoice-entry',
  templateUrl: './invoice-entry.component.html',
  styleUrls: ['./invoice-entry.component.scss']
})
export class InvoiceEntryComponent implements OnInit {

showViewInvoice = false;

  constructor() { }

  ngOnInit() {
 
  }

  close_onClick(e) {
		this.showViewInvoice = false;
  }
  
  viewInvoice(){
    this.showViewInvoice = true;
  }
}
