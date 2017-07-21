import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FacilitiesService, UserService, EmployeeService, WorkSpaceService } from '../../services/facility-manager/setup/index';
import { Facility, Employee } from '../../models/index';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Observable, Subscription } from 'rxjs/Rx';
@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  // tslint:disable-next-line:use-host-property-decorator
  host: { '(document:click)': 'hostClick($event)' },
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {

  facilityObj: Facility = <Facility>{};
  facilityName = '';
  searchControl = new FormControl();


  modal_on = false;
  logoutConfirm_on = false;
  innerMenuShow = false;
  changeFacilityLogo = false;
  changePassword = false;
  notificationSlideIn = false;

  facilityManagerActive = true;
  moduleManagerActive = false;

  facilitySubmenuActive = true;
  employeeSubmenuActive = false;
  userSubmenuActive = false;
  patientSubmenuActive = false;
  billingSebmenuActive = false;
  formsSubmenuActive = false;

  newModuleSubmenuActive = false;
  allModulesSubmenuActive = false;
  moduleAnalyticsSubmenuActive = false;

  loadIndicatorVisible = false;
  subscription: Subscription;
  loginEmployee: Employee = <Employee>{};

  constructor(private _elRef: ElementRef, private locker: CoolSessionStorage, private userService: UserService,
    private router: Router, public facilityService: FacilitiesService, private employeeService: EmployeeService,
    private workSpaceService: WorkSpaceService) {
    router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
  }
  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loadIndicatorVisible = true;
    }
    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.loadIndicatorVisible = false;
    }
  }
  ngOnInit() {
    this.facilityObj = <Facility>this.facilityService.getSelectedFacilityId();
    if (this.facilityObj !== undefined && this.facilityObj != null) {
      this.facilityName = this.facilityObj.name;
    }


    this.loadIndicatorVisible = true;
    const auth = <any>this.locker.getObject('auth');
    const emp$ = Observable.fromPromise(this.employeeService.find({
      query: {
        facilityId: this.facilityObj._id, personId: auth.data.personId, showbasicinfo: true
      }
    }));
    this.subscription = emp$.mergeMap((emp: any) => Observable.forkJoin(
      [
        Observable.fromPromise(this.employeeService.get(emp.data[0]._id, {})),
        Observable.fromPromise(this.workSpaceService.find({ query: { 'employeeId._id': emp.data[0]._id } })),
      ]))
      .subscribe((results: any) => {
        this.loginEmployee = results[0];
        this.loginEmployee.workSpaces = results[1].data;
        this.locker.setObject('loginEmployee', this.loginEmployee);
        // this.employeeService.announceLoginEmployee(this.loginEmployee);
        console.log(this.loginEmployee);
        this.loadIndicatorVisible = false;
      })
  }
  laboratorySubmenuShow() {
    this.innerMenuShow = false;
    this.router.navigate(['/dashboard/laboratory'])
  }

  onSwitchAccount() {
    this.router.navigate(['/accounts']);
  }
  onHealthCoverage() {
    this.innerMenuShow = false;
    this.router.navigate(['/dashboard/health-coverage']);
  }
  facilityMenuShow() {
    this.facilityManagerActive = true;
    this.moduleManagerActive = false;
    this.newModuleSubmenuActive = false;

    this.facilitySubmenuActive = true;
    this.employeeSubmenuActive = false;
    this.userSubmenuActive = false;
    this.patientSubmenuActive = false;
    this.billingSebmenuActive = false;
    this.formsSubmenuActive = false;
  }
  moduleMenuShow() {
    this.facilityManagerActive = false;
    this.moduleManagerActive = true;
    this.facilitySubmenuActive = false;
    this.newModuleSubmenuActive = true;

    this.newModuleSubmenuActive = true;
    this.allModulesSubmenuActive = false;
    this.moduleAnalyticsSubmenuActive = false;
    this.billingSebmenuActive = false;
    this.formsSubmenuActive = false;
  }

  facilitySubmenuShow() {
    this.facilitySubmenuActive = true;
    this.employeeSubmenuActive = false;
    this.userSubmenuActive = false;
    this.patientSubmenuActive = false;

    this.newModuleSubmenuActive = false;
    this.allModulesSubmenuActive = false;
    this.moduleAnalyticsSubmenuActive = false;

    this.innerMenuShow = false;
    this.billingSebmenuActive = false;
    this.formsSubmenuActive = false;
  }
  employeeSubmenuShow() {
    this.facilitySubmenuActive = false;
    this.employeeSubmenuActive = true;
    this.userSubmenuActive = false;
    this.patientSubmenuActive = false;

    this.newModuleSubmenuActive = false;
    this.allModulesSubmenuActive = false;
    this.moduleAnalyticsSubmenuActive = false;

    this.innerMenuShow = false;
    this.billingSebmenuActive = false;
    this.formsSubmenuActive = false;
  }
  userSubmenuShow() {
    this.facilitySubmenuActive = false;
    this.employeeSubmenuActive = false;
    this.userSubmenuActive = true;
    this.patientSubmenuActive = false;

    this.newModuleSubmenuActive = false;
    this.allModulesSubmenuActive = false;
    this.moduleAnalyticsSubmenuActive = false;

    this.innerMenuShow = false;
    this.billingSebmenuActive = false;
    this.formsSubmenuActive = false;
  }
  billingSubmenuShow() {
    this.facilitySubmenuActive = false;
    this.employeeSubmenuActive = false;
    this.userSubmenuActive = false;
    this.patientSubmenuActive = false;

    this.newModuleSubmenuActive = false;
    this.allModulesSubmenuActive = false;
    this.moduleAnalyticsSubmenuActive = false;

    this.innerMenuShow = false;
    this.billingSebmenuActive = true;
    this.formsSubmenuActive = false;
  }
  patientSubmenuShow() {
    this.facilitySubmenuActive = false;
    this.employeeSubmenuActive = false;
    this.userSubmenuActive = false;
    this.patientSubmenuActive = true;

    this.newModuleSubmenuActive = false;
    this.allModulesSubmenuActive = false;
    this.moduleAnalyticsSubmenuActive = false;
    this.formsSubmenuActive = false;

    this.innerMenuShow = false;
  }

  newModuleSubmenuShow() {
    this.newModuleSubmenuActive = true;
    this.allModulesSubmenuActive = false;
    this.moduleAnalyticsSubmenuActive = false;

    this.facilitySubmenuActive = false;
    this.employeeSubmenuActive = false;
    this.userSubmenuActive = false;
    this.patientSubmenuActive = false;
    this.formsSubmenuActive = false;
  }
  allModulesSubmenuShow() {
    this.newModuleSubmenuActive = false;
    this.allModulesSubmenuActive = true;
    this.moduleAnalyticsSubmenuActive = false;

    this.facilitySubmenuActive = false;
    this.employeeSubmenuActive = false;
    this.userSubmenuActive = false;
    this.patientSubmenuActive = false;
    this.formsSubmenuActive = false;
  }
  moduleAnalyticsSubmenuShow() {
    this.newModuleSubmenuActive = false;
    this.allModulesSubmenuActive = false;
    this.moduleAnalyticsSubmenuActive = true;

    this.facilitySubmenuActive = false;
    this.employeeSubmenuActive = false;
    this.userSubmenuActive = false;
    this.patientSubmenuActive = false;
    this.formsSubmenuActive = false;
  }
  formsSubmenuShow() {
    this.newModuleSubmenuActive = false;
    this.allModulesSubmenuActive = false;
    this.moduleAnalyticsSubmenuActive = false;

    this.facilitySubmenuActive = false;
    this.employeeSubmenuActive = false;
    this.userSubmenuActive = false;
    this.patientSubmenuActive = false;
    this.innerMenuShow = false;
    this.formsSubmenuActive = true;
  }
  innerMenuToggle() {
    this.innerMenuShow = !this.innerMenuShow;
  }
  innerMenuHide(e) {
    if (
      e.srcElement.className === 'inner-menu1-wrap' ||
      e.srcElement.localName === 'i' ||
      e.srcElement.id === 'innerMenu-ul'
    ) { } else {
      this.innerMenuShow = false;
    }
  }
  close_onClick(message: boolean): void {
    this.modal_on = false;
    this.logoutConfirm_on = false;
    this.changeFacilityLogo = false;
    this.changePassword = false;
  }
  logoutConfirm_show() {
    this.modal_on = false;
    this.logoutConfirm_on = true;
    this.innerMenuShow = false;
    this.changeFacilityLogo = false;
    this.changePassword = false;
  }
  onTags() {
    this.modal_on = false;
    this.logoutConfirm_on = false;
    this.innerMenuShow = false;
    this.changeFacilityLogo = false;
    this.changePassword = false;
  }
  show_changeFacilityLogo() {
    this.changeFacilityLogo = true;
    this.changePassword = false;
    this.modal_on = false;
    this.logoutConfirm_on = false;
  }
  changePass() {
    this.changeFacilityLogo = false;
    this.changePassword = true;
    this.modal_on = false;
    this.logoutConfirm_on = false;
  }
  notificationToggle() {
    this.notificationSlideIn = !this.notificationSlideIn;
  }

  // close main menu when clicked outside container
  hostClick(event) {
    if (!this._elRef.nativeElement.contains(event.target)) {
      this.innerMenuShow = false;
    }
  }

}
