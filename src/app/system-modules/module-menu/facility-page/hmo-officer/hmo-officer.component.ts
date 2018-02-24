import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hmo-officer',
  templateUrl: './hmo-officer.component.html',
  styleUrls: ['./hmo-officer.component.scss']
})
export class HmoOfficerComponent implements OnInit {

  billDetail_show = false;
  billHistoryDetail_show = false;
  tab1 = true;
  tab2 = false;

  constructor() { }

  ngOnInit() {
  }

  billDetail() {
    this.billDetail_show = true;
  }
  billHistoryDetail() {
    this.billHistoryDetail_show = true;
  }
  close_onClick() {
    this.billDetail_show = false;
    this.billHistoryDetail_show = false;
  }
  tab1_click() {
    this.tab1 = true;
    this.tab2 = false;
  }
  tab2_click() {
    this.tab1 = false;
    this.tab2 = true;
  }

}
