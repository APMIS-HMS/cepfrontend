import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-prescription',
  templateUrl: './customer-prescription.component.html',
  styleUrls: ['./customer-prescription.component.scss']
})
export class CustomerPrescriptionComponent implements OnInit {

  showCustomerDetail = false;
  constructor() { }

  ngOnInit() {
  }


  onShowCustomerDetail(){
    this.showCustomerDetail = true;
  }
 
}
