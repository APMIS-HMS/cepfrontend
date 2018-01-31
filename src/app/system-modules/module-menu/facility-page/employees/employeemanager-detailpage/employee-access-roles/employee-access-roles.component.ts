import { error } from 'selenium-webdriver';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

import {
  FeatureModuleService
} from '../../../../../../services/module-manager/setup/index';

import {
  CountriesService, FacilitiesService, UserService,
  PersonService, EmployeeService, GenderService, RelationshipService, MaritalStatusService,
} from '../../../../../../services/facility-manager/setup/index';


@Component({
  selector: 'app-employee-access-roles',
  templateUrl: './employee-access-roles.component.html',
  styleUrls: ['./employee-access-roles.component.scss']
})
export class EmployeeAccessRolesComponent implements OnInit {

  public userPrivileges: FormGroup; FormBuilder;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedEmployee;
  mainErr = true;
  errMsg = "";
  roles: any = [];

  rolesPicked: any = [];
  checboxLen: any;
  rolesRemoved: any = [];

  selectedFacility: any;
  // selectedEmployee: any;
  loggedInUser: any;
  loading: any;

  constructor(private formBuilder: FormBuilder, private featureService: FeatureModuleService,
    private locker: CoolLocalStorage, private facilityService: FacilitiesService,
    private systemModuleService: SystemModuleService) { }

  ngOnInit() {
    /* this.userPrivileges = this.FormBuilder.group({

    }); */
    console.log(this.selectedEmployee);
    this.selectedFacility = <any>this.locker.getObject('selectedFacility');
    let auth = <any>this.locker.getObject('auth');
    this.loggedInUser = auth.data;
    // this.selectedEmployee = <any>this.locker.getObject('selectedEmployee');

    this.getRoles();

  }

  close_onClick($event) {
    this.closeModal.emit(true);
  }

  getRoles() {
    /* this.featureService.findAll().then(payload => {
      console.log(payload);
      this.roles = payload.data;
    }); */
    console.log(this.selectedEmployee.personId);
    this.featureService.getFacilityRoles(this.selectedEmployee.personId, {
      query: {
        facilityId: this.selectedFacility._id
      }
    }).then(payload => {
      console.log(payload);
      if(payload.status === 'success'){
        this.roles = payload.data;
        console.log(this.roles);
      }
    });
  }

  pickRoles(event, id) {
    //console.log(this.checboxBool);
    //this.uncheck = true;
    console.log(event.checked);
    var checkedStatus = event.checked;
    console.log(checkedStatus);
    if (checkedStatus) {
      // let index = this.selectedFacilityIds.filter(x=>x.toString()==id.toString());
      let ind = this.rolesPicked.indexOf(id.toString());
      /* let indr = this.rolesRemoved.indexOf(id.toString());
      this.rolesRemoved.splice(indr, 1); */
      console.log(ind);
      if (ind > -1) {

      } else {
        this.rolesPicked.push(id.toString());
      }
    } else {
      let ind = this.rolesPicked.indexOf(id.toString());
      this.rolesPicked.splice(ind, 1);
      console.log(ind);

      let indr = this.rolesRemoved.indexOf(id.toString());
      if (indr > -1) {

      } else {
        this.rolesRemoved.push(id.toString());
      }
    }

    this.checboxLen = this.rolesPicked.length;

    console.log(this.rolesPicked);
    console.log(this.rolesRemoved);

  }

  saveRoles() {
    this.loading = true;
    let text = "You are about to assign roles to this employee";
    this.systemModuleService.announceSweetProxy(text, 'question', this);
  }

  createRoles() {
    var data = {
      personId: this.selectedEmployee.personId,
      facilityId: this.selectedFacility._id,
      roles: this.rolesPicked
    }
    console.log('www')
    this.featureService.assignUserRole(data).then(payload => {
      this.loading = false;
      console.log(payload);
    }, error =>{
      console.log(error);
    });
  }

  sweetAlertCallback(result) {
    console.log(result);
    if (result.value) {
      this.createRoles();
    }
  }


}
