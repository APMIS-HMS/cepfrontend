import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  pageInView;
  services = true;
  pricelist = false;
  contentSecMenuShow = false;

  constructor() { }

  ngOnInit() {
  }
  pageInViewLoader(title) {
    this.pageInView = title;
  }
  contentSecMenuToggle(){
    this.contentSecMenuShow = !this.contentSecMenuShow;
  }
  close_onClick(e) {
    if (
      e.srcElement.className === 'inner-menu1-wrap' ||
      e.srcElement.localName === 'i' ||
      e.srcElement.id === 'innerMenu-ul'
    ) { } else {
      this.contentSecMenuShow = false;
    }
  }
  servicesShow(){
    this.pricelist = false;
    this.services = true;
  }
  pricelistShow(){
    this.pricelist = true;
    this.services = false;
  }

}
