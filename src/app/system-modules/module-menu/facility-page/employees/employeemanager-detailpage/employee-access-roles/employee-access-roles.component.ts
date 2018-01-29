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




}
