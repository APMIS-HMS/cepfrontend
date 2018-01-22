import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import {
  CountriesService, FacilitiesService, UserService,
  PersonService, EmployeeService, GenderService, RelationshipService, MaritalStatusService,
} from '../../../../../services/facility-manager/setup/index';
import { Facility, User, Employee, Person, Country, Gender, Relationship, MaritalStatus } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  mainErr = true;
  errMsg = "";
  public facilityForm1: FormGroup;

  searchedFacilities: any;
  LoggedInFacility;
  selectedFacilityIds = [];
  facilityMember;
  searchedLength;

  checboxLen;

  loading;

  constructor(private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    public facilityService: FacilitiesService,
    private userService: UserService,
    private personService: PersonService,
    private locker: CoolLocalStorage) { }

  ngOnInit() {
    this.LoggedInFacility = <any>this.locker.getObject("selectedFacility");
    this.facilityForm1 = this.formBuilder.group({
      facilitySearch: ['', []]
    });

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
    var checkedStatus = event.srcElement.checked;
    if (checkedStatus) {
      // let index = this.selectedFacilityIds.filter(x=>x.toString()==id.toString());
      let ind = this.selectedFacilityIds.indexOf(id.toString());
      console.log(ind);
      if (ind > -1) {
        this.selectedFacilityIds.splice(ind, 1);
      } else {
        this.selectedFacilityIds.push(id.toString());
      }
    }

    this.checboxLen = this.selectedFacilityIds.length;

    console.log(this.selectedFacilityIds);

  }

  add() {
    this.loading = true;
    let fac = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: this.selectedFacilityIds
    }
    this.facilityService.addNetwork(fac).then(payload => {
      this.loading = false;
      this.close_onClick();
    }, error => {
      console.log(error);
    });
  }

}
