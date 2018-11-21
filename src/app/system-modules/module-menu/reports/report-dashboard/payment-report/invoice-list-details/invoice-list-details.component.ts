import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-list-details',
  templateUrl: './invoice-list-details.component.html',
  styleUrls: ['./invoice-list-details.component.scss']
})
export class InvoiceListDetailsComponent implements OnInit {


  dateRange: any;
  
  paymentSummary = false;

  invoiceA = false;
  invoiceB = false;
  invoiceC = false;
  invoiceD = false;
  invoiceE = false;

  constructor(private _router: Router) { }

  ngOnInit() {
    // const page: string = this._router.url;
    // this.checkPageUrl(page);
  }


  showInvoiceA() {
    this.invoiceA = !this.invoiceA;
    this.invoiceB = false;
    this.invoiceC = false;
    this.invoiceD = false;
    this.invoiceE = false;
  }

  showInvoiceB() {
    this.invoiceB = !this.invoiceB;
    this.invoiceA = false;
    this.invoiceC = false;
    this.invoiceD = false;
    this.invoiceE = false;
  }
  showInvoiceC() {
    this.invoiceC = !this.invoiceC;
    this.invoiceA = false;
    this.invoiceB = false;
    this.invoiceD = false;
    this.invoiceE = false;
  }
  showInvoiceD() {
    this.invoiceD = !this.invoiceD;
    this.invoiceA = false;
    this.invoiceB = false;
    this.invoiceC = false;
    this.invoiceE = false;
  }
  showInvoiceE() {
    this.invoiceE = !this.invoiceE;
    this.invoiceA = false;
    this.invoiceB = false;
    this.invoiceC = false;
    this.invoiceD = false;
  }

}
