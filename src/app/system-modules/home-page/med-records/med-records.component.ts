import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-med-records',
  templateUrl: './med-records.component.html',
  styleUrls: ['./med-records.component.scss']
})
export class MedRecordsComponent implements OnInit {

  homeContentArea = true;
  docsContentArea= false;
  prescriptionContentArea = false;
  consultationContentArea = false;
  paymentContentArea = false;

  constructor() { }

  ngOnInit() {
  }

  home(){
    this.homeContentArea = true;
    this.docsContentArea= false;
    this.prescriptionContentArea = false;
    this.consultationContentArea = false;
    this.paymentContentArea = false;
  }
  doc(){
    this.homeContentArea = false;
    this.docsContentArea= true;
    this.prescriptionContentArea = false;
    this.consultationContentArea = false;
    this.paymentContentArea = false;
  }
  prescription(){
    this.homeContentArea = false;
    this.docsContentArea= false;
    this.prescriptionContentArea = true;
    this.consultationContentArea = false;
    this.paymentContentArea = false;
  }
  consultation(){
    this.homeContentArea = false;
    this.docsContentArea= false;
    this.prescriptionContentArea = false;
    this.consultationContentArea = true;
    this.paymentContentArea = false;
  }
  payment(){
    this.homeContentArea = false;
    this.docsContentArea= false;
    this.prescriptionContentArea = false;
    this.consultationContentArea = false;
    this.paymentContentArea = true;
  }

}
