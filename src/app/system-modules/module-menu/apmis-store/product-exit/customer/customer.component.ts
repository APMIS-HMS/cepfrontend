import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  prescriptionList = true;
  selectedPrescription = false;
  constructor() { }

  ngOnInit() {
  }

  onSelectedPrescription() {
    this.prescriptionList = false;
    this.selectedPrescription = true;
  }

}
