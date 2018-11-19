import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-summary-page',
  templateUrl: './payment-summary-page.component.html',
  styleUrls: ['./payment-summary-page.component.scss']
})
export class PaymentSummaryPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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

}
