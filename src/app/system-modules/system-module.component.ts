import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService, FacilitiesService, PersonService, EmployeeService } from '../services/facility-manager/setup/index';
import { Person, Facility } from '../models/index';
import { Router } from '@angular/router';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-system-module',
  templateUrl: './system-module.component.html',
  styleUrls: ['./system-module.component.scss']
})
export class SystemModuleComponent implements OnInit {
  dmenu = false;

  searchControl = new FormControl();

  facilityManagerActive = true;
  moduleManagerActive = false;
  isLoggedOut = false;
  selectedUser: any;
  selectedPerson: Person = <Person>{};
  authData: any = <any>{};
  checkedInObject: any = <any>{};

  constructor(private userService: UserService,
    public facilityService: FacilitiesService,
    private personService: PersonService,
    private employeeService: EmployeeService,
    private toast: ToastsManager,
    private router: Router, private locker: CoolSessionStorage) {
    this.facilityService.notificationAnnounced$.subscribe((obj: any) => {
      if (obj.type === 'Success') {
        this.success(obj.text);
      } else if (obj.type === 'Error') {
        this.error(obj.text);
      } else if (obj.type === 'Info') {
        this.info(obj.text);
      }
    });
    this.facilityService.listner.subscribe(payload => {
      const facility: Facility = <Facility>this.locker.getObject('selectedFacility');
      if (facility._id === payload._id) {
        this.locker.setObject('selectedFacility', payload);
      }
    });
    this.userService.missionAnnounced$.subscribe(payload => {
      if (payload === 'out') {
        this.isLoggedOut = true;
        this.router.navigate(['/']);
      } else if (payload === 'in') {

      }
    });
    let auth: any = this.locker.getObject('auth');
    let authData = auth.data;
    this.personService.get(authData.personId, {}).then(ppayload => {
      this.selectedPerson = ppayload;
    });
    this.employeeService.checkInAnnounced$.subscribe(payload => {
      this.checkedInObject = payload;
    });
    this.personService.updateListener.subscribe((payload: Person) => {
       auth = this.locker.getObject('auth');
      authData = auth.data;
      if (authData.personId === payload._id) {
        this.selectedPerson = payload;
      }
    });
  }

  ngOnInit() {
    const auth: any = this.locker.getObject('auth');
    this.authData = auth.data;
    // this.personService.get(authData.personId, {}).then(ppayload => {
    //   this.selectedPerson = ppayload;
    // });
  }

  success(text) {
    this.toast.success(text, 'Success!');
  }
  error(text) {
    this.toast.error(text, 'Error!');
  }
  info(text) {
    this.toast.info(text, 'Info');
  }
  facilityManager_onClick() {
    this.facilityManagerActive = true;
    this.moduleManagerActive = false;
  }
  moduleManager_onClick() {
    this.moduleManagerActive = true;
    this.facilityManagerActive = false;
  }
  dmenuShow() {
    this.dmenu = !this.dmenu;
  }
}
