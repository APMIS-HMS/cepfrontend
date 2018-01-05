import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facilitypage-sidesect',
  templateUrl: './facilitypage-sidesect.component.html',
  styleUrls: ['./facilitypage-sidesect.component.scss']
})
export class FacilitypageSidesectComponent implements OnInit {

  editBasicInfo = false;

  constructor() { }

  ngOnInit() {
  }

  close_onClick(e){
    this.editBasicInfo = false;
  }
  editBasicInfo_onClick(){
    this.editBasicInfo = true;
  }

}
