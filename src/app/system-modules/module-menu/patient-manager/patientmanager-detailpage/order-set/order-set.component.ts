import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-order-set',
  templateUrl: './order-set.component.html',
  styleUrls: ['./order-set.component.scss']
})
export class OrderSetComponent implements OnInit {

  template: FormControl = new FormControl();
  diagnosis: FormControl = new FormControl();

  apmisLookupQuery = {};
  apmisLookupUrl = '';
  apmisLookupDisplayKey = '';
  apmisLookupText = '';

  popMed = false;
  popInvestigation = false;
  popNursingCare = false;
  popPhysicianOrder = false;
  popProcedure = false;

  constructor() { }

  ngOnInit() {
  }

  popMed_show(){
    this.popMed = true;
  }
  popInvestigation_show(){
    this.popInvestigation = true;
  }
  popNursingCare_show(){
    this.popNursingCare = true;
  }
  popPhysicianOrder_show(){
    this.popPhysicianOrder = true;
  }
  popProcedure_show(){
    this.popProcedure = true;
  }
  close_onClick(e){
    this.popMed = false;
    this.popInvestigation = false;
    this.popNursingCare = false;
    this.popPhysicianOrder = false;
    this.popProcedure = false;
  }

}
