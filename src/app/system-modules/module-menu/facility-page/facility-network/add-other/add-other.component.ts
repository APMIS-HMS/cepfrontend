import { Observable } from 'rxjs/Observable';
import { SystemModuleService } from './../../../../../services/module-manager/setup/system-module.service';
import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import {
  CountriesService, FacilitiesService, UserService,
  PersonService, EmployeeService, GenderService, RelationshipService, MaritalStatusService,
} from '../../../../../services/facility-manager/setup/index';
import { Facility, User, Employee, Person, Country, Gender, Relationship, MaritalStatus } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-add-other',
  templateUrl: './add-other.component.html',
  styleUrls: ['./add-other.component.scss']
})
export class AddOtherComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

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
    public systemModuleService: SystemModuleService,
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
      .switchMap(value => this.searchEntries(value))
      .subscribe((por: any) => {
        console.log(por);
        this.searchedFacilities = por.data;
        this.searchedLength = por.data.length;
      })


  }
  searchEntries(value) {
    if (value.length < 3) {
      return Observable.of({ data: [] })
    }
    return this.facilityService.find({ query: { name: { $regex: value, '$options': 'i' } } })
  }
  close_onClick() {
    this.closeModal.emit(true);
  }


  add() {
    this.loading = true;
    this.systemModuleService.on();
    let fac = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: this.selectedFacilityIds
    }
    this.facilityService.joinNetwork(fac, false).then(payload => {
      console.log(payload);
      this.facilityService.get(fac.hostId, {}).then(payl => {
        this.loading = false;
        let facc = payl.data;
        console.log(payl);
        this.close_onClick();
        this.systemModuleService.off();
      }, error => {
        this.systemModuleService.off();
      })

    }, error => {
      this.systemModuleService.off();
      console.log(error);
    });
  }

  update() {
    this.loading = true;
    this.systemModuleService.on();
    let facRemove = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: this.removeFacilities
    }
    let fac = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: this.selectedFacilityIds
    }
    this.facilityService.joinNetwork(facRemove, true).then(paylRemove => {
      console.log(paylRemove);
      this.facilityService.joinNetwork(fac, false).then(payload => {
        console.log(payload);
        this.facilityService.get(fac.hostId, {}).then(payl => {
          this.loading = false;
          let facc = payl.data;
          console.log(payl);
          this.close_onClick();
          this.systemModuleService.off();
        }, error => {
          this.systemModuleService.off();
        });

      }, error => {
        console.log(error);
        this.systemModuleService.off();
      });

    }, error => {
      console.log(error);
      this.systemModuleService.off();
    });
  }


  pickFacilitiesMemberOf(event, id) {
    //console.log(this.checboxBool);
    var checkedStatus = event.target.value;
    console.log(checkedStatus);
    if (checkedStatus) {
      let index = this.selectedFacilityIds.filter(x => x == id);
      let ind = this.selectedFacilityIds.indexOf(id);
      console.log(ind);
      if (ind > -1) {
        this.selectedFacilityIds.splice(ind, 1);
      } else {
        this.selectedFacilityIds.push(id);
      }
    }

    this.checboxLen = this.selectedFacilityIds.length;

    console.log(this.selectedFacilityIds);

  }
  confirmUpdate(from) {
    const question = 'Are you sure you want to join this netweork?';
    this.systemModuleService.announceSweetProxy(question, 'question', this, null, null, 'update');
  }

  sweetAlertCallback(result, from) {
    console.log(result);
    if (result.value) {
      if (from === 'update') {
        this.update();
      } else {
        this.add();
      }
    }
  }
}
