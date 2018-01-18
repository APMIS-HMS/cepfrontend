import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facility-network',
  templateUrl: './facility-network.component.html',
  styleUrls: ['./facility-network.component.scss']
})
export class FacilityNetworkComponent implements OnInit {

  addMember = false;
  addOther = false;

  constructor() { }

  ngOnInit() {
  }

  close_onClick(e){
    this.addMember = false;
    this.addOther = false;
  }

  addMember_click(){
    this.addMember = true;
  }
  addOther_click(){
    this.addOther = true;
  }

}
