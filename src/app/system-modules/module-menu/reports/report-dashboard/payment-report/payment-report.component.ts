import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit {

  paymentSummary = false;
  invoiceListPage = false;

  pageInView = 'Payment Report Page';

  constructor(private _router: Router) { }

  ngOnInit() {
    const page: string = this._router.url;
    this.checkPageUrl(page);
  }


  checkPageUrl(param: string) {
    if (param.includes('paymentSummary')) {
      this.paymentSummary = true;
      this.invoiceListPage = false;
      this._router.navigate(['/dashboard/reports/report-dashboard/paymentReport/paymentSummary']);
    } else if (param.includes('invoiceListPage')) {
      this.paymentSummary = false;
      this.invoiceListPage = true; 
      this._router.navigate(['/dashboard/reports/report-dashboard/paymentReport/invoiceList']);
    } else {
      this.paymentSummary = true;
      this.invoiceListPage = false; 
      this._router.navigate(['/dashboard/reports/report-dashboard/paymentReport/paymentSummary']);
    }
  }


  call_paymentSummary(){
    this.paymentSummary = true;
    this.invoiceListPage = false;
    this._router.navigate(['/dashboard/reports/report-dashboard/paymentReport/paymentSummary']);
  }

  call_invoiceList(){
    this.paymentSummary = false;
    this.invoiceListPage = true;
    this._router.navigate(['/dashboard/reports/report-dashboard/paymentReport/invoiceList']);
  }

  back_dashboard() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
	  }
}
