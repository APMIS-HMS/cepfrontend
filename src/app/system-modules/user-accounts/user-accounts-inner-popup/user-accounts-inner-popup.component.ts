import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { UserService, EmployeeService, PatientService } from '../../../services/facility-manager/setup/index';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-user-accounts-inner-popup',
  templateUrl: './user-accounts-inner-popup.component.html',
  styleUrls: ['./user-accounts-inner-popup.component.scss']
})
export class UserAccountsInnerPopupComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedFacility: any;
  @Input() loginEmployee: any;

  constructor(private router: Router, private locker: CoolSessionStorage,
    private employeeService: EmployeeService, private patientService: PatientService,
    private userService: UserService) { }

  ngOnInit() {
    console.log(this.loginEmployee)
    this.patientService.find({query:{personId:this.loginEmployee.personId}}).then(payload =>{
      console.log(payload)
    })
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  isEmployeeInFacility() {
    if (this.loginEmployee === undefined) {
      return false;
    } else {
      return true;
    }
  }
  isPatientInFacility() {
    console.log(this.loginEmployee)
  }
  loadEmployeeRecord() {
    this.locker.setObject('selectedFacility', this.selectedFacility);
    this.router.navigate(['dashboard']).then(() => {
      this.userService.announceMission('in');
    });
  }
}
