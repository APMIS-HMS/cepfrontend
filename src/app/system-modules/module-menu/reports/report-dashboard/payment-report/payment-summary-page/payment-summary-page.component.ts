import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {IPaymentReportSummaryModel} from "../../../../../../core-ui-modules/ui-components/PaymentReportModel";
import {PaymentReportGenerator} from "../../../../../../core-ui-modules/ui-components/report-generator-service";

@Component({
  selector: 'app-payment-summary-page',
  templateUrl: './payment-summary-page.component.html',
  styleUrls: ['./payment-summary-page.component.scss']
})
export class PaymentSummaryPageComponent implements OnInit {
  
  summary : IPaymentReportSummaryModel = { totalSales :  0};
  loading  : boolean = false;
  constructor(private _router: Router,  private paymentReportService : PaymentReportGenerator) { }

  ngOnInit() {
    this.getReportSummary();
  }

  public pieChartLabels:string[] = ['Cash', 'E-Payment', 'Cheque', 'Transfer'];
  public pieChartData:number[] = [70000, 10000, 50000, 50000];
  public pieChartType:string = 'pie';
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
  public chartHovered(e:any):void {
    console.log(e);
  }

  call_invoiceList(){
    this._router.navigate(['/dashboard/reports/report-dashboard/paymentReport/invoiceList']);
  }
  
  getReportSummary()
  {
    this.loading  = true;
    this.paymentReportService.getPaymentReportSummary()
        .then(x => {
          this.summary   = x.data;
          this.loading = false;
        });
  }
  
  
  
}
