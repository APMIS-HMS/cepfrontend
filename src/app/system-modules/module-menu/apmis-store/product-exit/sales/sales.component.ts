import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  showCashCustomer = true;
  showAPMIScustomer= false;
  showCustomerDetail = false;
  viewPrescriptionBTN = true;
  constructor() { }

  ngOnInit() {
  }

  onShowCashCustomer(){
    this.showCashCustomer = true;
    this.showAPMIScustomer= false;
  }

  onShowAPMISCustomer(){
    this.showCashCustomer = false;
    this.showAPMIScustomer= true;
  }

  onShowCustomerDetail(){
    this.showCustomerDetail = true;
    this.viewPrescriptionBTN = false;
  }

}
