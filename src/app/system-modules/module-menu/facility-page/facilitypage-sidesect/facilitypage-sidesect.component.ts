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
  membersOf: any;
  memberFacilities:any = [];

  constructor(private facilityService:FacilitiesService, private locker:CoolLocalStorage) {
    this.facilityService.patchListner.subscribe(payload =>{
      console.log(payload);
      this.selectedFacility = payload;
      this.locker.setObject('selectedFacility', payload);
    });
   }

  ngOnInit() {
    //this.getNetworkMembers(false);
    this.getNetworkMembers(true);
  }

  close_onClick(e){
    this.editBasicInfo = false;
  }
  editBasicInfo_onClick(){
    this.editBasicInfo = true;
  }

  getNetworkMembers(isMemberOf){
    this.facilityService.getNetwork(this.selectedFacility._id, isMemberOf).then(payload => {
      if(isMemberOf){
        this.membersOf = payload;
        console.log(this.membersOf);
      }else{
        this.memberFacilities = payload;
        console.log(this.memberFacilities);
      }
      //console.log(payload);
    });
  }

}
