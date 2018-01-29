import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import {
  CountriesService, FacilitiesService, UserService,
  PersonService, EmployeeService, GenderService, RelationshipService, MaritalStatusService,
} from '../../../../../services/facility-manager/setup/index';
import { Facility, User, Employee, Person, Country, Gender, Relationship, MaritalStatus } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() memberAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  mainErr = true;
  errMsg = "";
  public facilityForm1: FormGroup;

  searchedFacilities: any;
  LoggedInFacility;
  selectedFacilityIds = [];
  facilityMember;
  searchedLength;

  removeFacilities = [];

  checboxLen;
  uncheck;

  loading;

  constructor(private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    public facilityService: FacilitiesService,
    private userService: UserService,
    private personService: PersonService,
    private locker: CoolLocalStorage,
  private systemService: SystemModuleService) { }

  ngOnInit() {
    this.LoggedInFacility = <any>this.locker.getObject("selectedFacility");
    this.facilityForm1 = this.formBuilder.group({
      facilitySearch: ['', []]
    });

    this.selectedFacilityIds = this.LoggedInFacility.memberFacilities;
    console.log(this.selectedFacilityIds);

    this.facilityForm1.controls['facilitySearch'].valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(value => this.facilityService.find({ query: { name: { $regex: value, '$options': 'i' } } }))
      .subscribe((por: any) => {
        console.log(por);
        this.searchedFacilities = por.data;
        this.searchedLength = por.data.length;
      })
  }
  close_onClick() {
    this.closeModal.emit(true);
  }

  pickMemberFacilities(event, id) {
    //console.log(this.checboxBool);
    this.uncheck = true;
    var checkedStatus = event.srcElement.checked;
    console.log(checkedStatus);
    if (checkedStatus) {
      // let index = this.selectedFacilityIds.filter(x=>x.toString()==id.toString());
      let ind = this.selectedFacilityIds.indexOf(id.toString());
      let indr = this.removeFacilities.indexOf(id.toString());
      this.removeFacilities.splice(indr, 1);
      console.log(ind);
      if (ind > -1) {
        
      } else {
        this.selectedFacilityIds.push(id.toString());
      }
    }else{
      let ind = this.selectedFacilityIds.indexOf(id.toString());
      this.selectedFacilityIds.splice(ind, 1);
      console.log(ind); 

      let indr = this.removeFacilities.indexOf(id.toString());
      if (indr > -1) {
        
      } else {
        this.removeFacilities.push(id.toString());
      }
    }

    this.checboxLen = this.selectedFacilityIds.length;

    console.log(this.selectedFacilityIds);
    console.log(this.removeFacilities);

  }

  add() {
    this.loading = true;
    let fac = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: this.selectedFacilityIds
    }
    this.facilityService.addNetwork(fac, false).then(payload => {
      console.log(payload);
      this.facilityService.get(fac.hostId, {}).then(payl => {
        this.loading = false;
        let facc = payl.data;
        console.log(payl);
        this.systemService.announceSweetProxy('Facilities has successfully been added to your Network!.', 'success', this);
        this.close_onClick();
      })
      
    }, error => {
      console.log(error);
      this.systemService.announceSweetProxy('Something went wrong. Please Try Again!', 'error');
    });
  }

  update(){
    this.loading = true;
    let facRemove = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: this.removeFacilities
    }
    let fac = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: this.selectedFacilityIds
    }
    this.facilityService.addNetwork(facRemove, true).then(paylRemove => {
      console.log(paylRemove);
      this.facilityService.addNetwork(fac, false).then(payload => {
        console.log(payload);
        this.facilityService.get(fac.hostId, {}).then(payl => {
          this.loading = false;
          let facc = payl.data;
          
          console.log(facc);
          this.systemService.announceSweetProxy('Network has successfully been Updated!.', 'success', this);
          console.log(payl);
          this.close_onClick();
        })
        
      }, error => {
        console.log(error);
        this.systemService.announceSweetProxy('Something went wrong. Please Try Again!', 'error');
      });
      
    }, error => {
      console.log(error);
      this.systemService.announceSweetProxy('Something went wrong. Please Try Again!', 'error');
    });
  }

  sweetAlertCallback(result){
    this.memberAdded.emit(true);
  }

}
