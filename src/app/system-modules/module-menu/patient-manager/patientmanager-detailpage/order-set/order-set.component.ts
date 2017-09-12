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

  constructor() { }

  ngOnInit() {
  }

  popMed_show(){
    this.popMed = true;
  }
  close_onClick(e){
    this.popMed = false;
  }

}
