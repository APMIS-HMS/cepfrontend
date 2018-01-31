import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FacilitiesService, UserService, EmployeeService, WorkSpaceService } from '../../services/facility-manager/setup/index';
import { Facility, Employee } from '../../models/index';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
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

  checkedInObject: any = <any>{};
  constructor(private _elRef: ElementRef, private locker: CoolLocalStorage, private userService: UserService,
    private router: Router, public facilityService: FacilitiesService, private employeeService: EmployeeService,
    private workSpaceService: WorkSpaceService) {
    // router.events.subscribe((routerEvent: Event) => {
    //   this.checkRouterEvent(routerEvent);
    // });
  }
  // checkRouterEvent(routerEvent: Event): void {
  //   if (routerEvent instanceof NavigationStart) {
  //     this.loadIndicatorVisible = true;
  //   }
  //   if (routerEvent instanceof NavigationEnd ||
  //     routerEvent instanceof NavigationCancel ||
  //     routerEvent instanceof NavigationError) {
  //     this.loadIndicatorVisible = false;
  //   }
  // }
  ngOnInit() {
    this.facilityObj = <Facility>this.facilityService.getSelectedFacilityId();
    if (this.facilityObj !== undefined && this.facilityObj != null) {
      this.facilityName = this.facilityObj.name;
    }
    this.employeeService.checkInAnnounced$.subscribe(payload => {
      this.checkedInObject = payload;
    });
    this.facilityService.listner.subscribe(pay => {
      this.facilityName = pay.name;
    });
    this.facilityService.patchListner.subscribe(pay => {
      this.facilityName = pay.name;
    });
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    const auth = <any>this.locker.getObject('auth');
    if (this.loginEmployee !== null && this.loginEmployee._id !== undefined && auth.data.personId === this.loginEmployee.personId) {
      return;
    }
    this.loadIndicatorVisible = true;

    const emp$ = Observable.fromPromise(this.employeeService.find({
      query: {
        facilityId: this.facilityObj._id, personId: auth.data.personId, $select:['personId']
      }
    }));
    this.subscription = emp$.mergeMap((emp: any) => {
      if (emp.data.length > 0) {
        return Observable.forkJoin(
          [
            Observable.fromPromise(this.employeeService.get(emp.data[0]._id, {})),
            Observable.fromPromise(this.workSpaceService.find({ query: { 'employeeId._id': emp.data[0]._id } })),
            Observable.fromPromise(this.facilityService
              .find({
                query: {
                  '_id': this.facilityObj._id,
                  $select: ['name', 'email', 'contactPhoneNo', 'contactFullName', 'shortName', 'website', 'logoObject']
                }
              }))
          ])
      } else {
        this.loadIndicatorVisible = false;
        return Observable.of({})
      }
    }
    ).subscribe((results: any) => {
      if (results[0] !== undefined) {
        this.loginEmployee = results[0];
        this.loginEmployee.workSpaces = results[1].data;
        this.locker.setObject('workspaces', this.loginEmployee.workSpaces)

        if (results[2].data.length > 0) {
          this.locker.setObject('miniFacility', results[2].data[0])
        }

        this.locker.setObject('loginEmployee', this.loginEmployee);
      }

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
