import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import {
  FeatureModuleService
} from '../../../../../../services/module-manager/setup/index';


@Component({
  selector: 'app-employee-access-roles',
  templateUrl: './employee-access-roles.component.html',
  styleUrls: ['./employee-access-roles.component.scss']
})
export class EmployeeAccessRolesComponent implements OnInit {

  public userPrivileges: FormGroup; FormBuilder;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = "";
  roles: any;

  rolesPicked:any = [];
  checboxLen:any;
  rolesRemoved:any = [];

  constructor(private formBuilder: FormBuilder, private featureService: FeatureModuleService) { }

  ngOnInit() {
    /* this.userPrivileges = this.FormBuilder.group({

    }); */

    this.getRoles();

  }

  close_onClick(event) {
    this.closeModal.emit(true);
  }

  getRoles(){
    this.featureService.findAll().then(payload => {
      console.log(payload);
      this.roles = payload.data;
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
    }else{
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


}
