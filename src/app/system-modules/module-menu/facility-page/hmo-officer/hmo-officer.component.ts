import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hmo-officer',
  templateUrl: './hmo-officer.component.html',
  styleUrls: ['./hmo-officer.component.scss']
})
export class HmoOfficerComponent implements OnInit {

  billDetail_show = false;

  constructor() { }

  ngOnInit() {
  }

  billDetail(){
    this.billDetail_show = true;
  }
  close_onClick(){
    this.billDetail_show = false;
  }

}
