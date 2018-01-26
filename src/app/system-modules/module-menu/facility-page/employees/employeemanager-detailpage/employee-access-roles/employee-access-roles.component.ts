import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-employee-access-roles',
  templateUrl: './employee-access-roles.component.html',
  styleUrls: ['./employee-access-roles.component.scss']
})
export class EmployeeAccessRolesComponent implements OnInit {

  public userPrivileges: FormGroup;  FormBuilder;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = "";

  constructor( private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.userPrivileges = this.FormBuilder.group({

  });
    
  }

  close_onClick(event) {
    this.closeModal.emit(true);
  }
}
