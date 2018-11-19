import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('this is payment 4');
  }

}
