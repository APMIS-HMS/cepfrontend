import { Component, OnInit } from '@angular/core';

import {
  CountriesService, FacilitiesService, UserService,
  PersonService, EmployeeService, GenderService, RelationshipService, MaritalStatusService,
} from '../../../../services/facility-manager/setup/index';

import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-facility-network',
  templateUrl: './facility-network.component.html',
  styleUrls: ['./facility-network.component.scss']
})
export class FacilityNetworkComponent implements OnInit {

  addMember = false;
  addOther = false;

  LoggedInFacility;

  members:any;
  others:any;

  constructor(public facilityService: FacilitiesService, private locker: CoolLocalStorage) { }

  ngOnInit() {
    this.LoggedInFacility = <any>this.locker.getObject("selectedFacility");

    this.getNetworks(true);
    this.getNetworks(false);
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

<<<<<<< HEAD
  leaveNetwork(id){
    console.log(id);
    let fac = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: [id]
    }
    this.facilityService.joinNetwork(fac, true).then(payl => {
      this.getNetworks(true);
    })
  }

  removeMember(id){
    console.log(id);
    let fac = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: [id]
    }
    this.facilityService.addNetwork(fac, true).then(payl => {
      this.getNetworks(false);
    })
  }

  getNetworks(isMemberOf){
    this.facilityService.getNetwork(this.LoggedInFacility._id, isMemberOf).then(payload => {
      if(isMemberOf){
        this.others = payload;
        console.log(this.others);
      }else{
        this.members = payload;
        console.log(this.members);
      }
      //console.log(payload);
    });
  }

=======
>>>>>>> 3df60e0830bfff39d793124a8e94a1fc57ce803b
}
