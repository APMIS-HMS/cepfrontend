import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-med-records',
  templateUrl: './med-records.component.html',
  styleUrls: ['./med-records.component.scss']
})
export class MedRecordsComponent implements OnInit {

  inmenu_home = true;
  inmenu_med = false;
  inmenu_prescription = false;
  inmenu_consultation = false;
  inmenu_payment = false;

  constructor() { }

  ngOnInit() {
  }

  inmenu_home_click(){
    this.inmenu_home = true;
    this.inmenu_med = false;
    this.inmenu_prescription = false;
    this.inmenu_consultation = false;
    this.inmenu_payment = false;
  }
  inmenu_med_click(){
    this.inmenu_home = false;
    this.inmenu_med = true;
    this.inmenu_prescription = false;
    this.inmenu_consultation = false;
    this.inmenu_payment = false;
  }
  inmenu_prescription_click(){
    this.inmenu_home = false;
    this.inmenu_med = false;
    this.inmenu_prescription = true;
    this.inmenu_consultation = false;
    this.inmenu_payment = false;
  }
  inmenu_consultation_click(){
    this.inmenu_home = false;
    this.inmenu_med = false;
    this.inmenu_prescription = false;
    this.inmenu_consultation = true;
    this.inmenu_payment = false;
  }
  inmenu_payment_click(){
    this.inmenu_home = false;
    this.inmenu_med = false;
    this.inmenu_prescription = false;
    this.inmenu_consultation = false;
    this.inmenu_payment = true;
  }
}
