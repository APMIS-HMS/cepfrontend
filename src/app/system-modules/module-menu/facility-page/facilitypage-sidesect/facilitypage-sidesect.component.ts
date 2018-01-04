import { CoolLocalStorage } from 'angular2-cool-storage';
import { FacilitiesService } from './../../../../services/facility-manager/setup/facility.service';
import { Facility } from './../../../../models/facility-manager/setup/facility';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-facilitypage-sidesect',
  templateUrl: './facilitypage-sidesect.component.html',
  styleUrls: ['./facilitypage-sidesect.component.scss']
})
export class FacilitypageSidesectComponent implements OnInit {
  @Input() selectedFacility: any = <any>{};
  editBasicInfo = false;

  constructor(private facilityService:FacilitiesService, private locker:CoolLocalStorage) {
    this.facilityService.patchListner.subscribe(payload =>{
      console.log(payload);
      this.selectedFacility = payload;
      this.locker.setObject('selectedFacility', payload);
    });
   }

  ngOnInit() {
  }

  close_onClick(e){
    this.editBasicInfo = false;
  }
  editBasicInfo_onClick(){
    this.editBasicInfo = true;
  }

}
