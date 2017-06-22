import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-home',
  templateUrl: './payment-home.component.html',
  styleUrls: ['./payment-home.component.scss']
})
export class PaymentHomeComponent implements OnInit {

  pageInView = 'Payment';

  constructor() { }

  ngOnInit() {
  }
  pageInViewLoader(title) {
    this.pageInView = title;
  }

}
