import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-order-set',
  templateUrl: './order-set.component.html',
  styleUrls: ['./order-set.component.scss']
})
export class OrderSetComponent implements OnInit {

  @Output() showDoc: EventEmitter<boolean> = new EventEmitter<boolean>();

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

  showbill= false;

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
    this.showbill = false;
  }
  authorizerx(){
    this.showDoc.emit(true);
  }
  showbill_click(){
    this.showbill = true;
  }

  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    let isExisting = false;
    // this.loginHMOListObject.companyCovers.forEach(item => {
    //   if (item._id === value._id) {
    //     isExisting = true;
    //   }
    // });
    // if (!isExisting) {
    //   this.selectedCompanyCover = value;
    // } else {
    //   this.selectedCompanyCover = <any>{};
    //   this._notification('Info', 'Selected HMO is already in your list of Company Covers');
    // }
  }

}
