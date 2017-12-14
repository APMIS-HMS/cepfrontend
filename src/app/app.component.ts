import { SystemModuleService } from './services/module-manager/setup/system-module.service';
import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {
  FacilitiesService, AppointmentService, AppointmentTypeService, ProfessionService, EmployeeService, WorkSpaceService
} from './services/facility-manager/setup/index';
import { Facility, Employee, ClinicModel, AppointmentType, Appointment, Profession } from './models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LoadingBarService } from '@ngx-loading-bar/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loadIndicatorVisible = true;
  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  auth: any;
  subscription: Subscription;

  constructor(router: Router, private vcr: ViewContainerRef, private toastr: ToastsManager,
    private employeeService: EmployeeService, private workSpaceService: WorkSpaceService,
    private facilityService: FacilitiesService, private locker: CoolLocalStorage,
    private systemModuleService: SystemModuleService, private loadingService: LoadingBarService, ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.facilityService.notificationAnnounced$.subscribe((obj: any) => {
      if (obj.users !== undefined && obj.users.length > 0) {
        const auth: any = this.locker.getObject('auth');
        if (auth !== undefined) {
          const userId = auth._id;
          const isUserIdIncluded = obj.users.filter(x => x === userId).length > 0;
          if (isUserIdIncluded === true) {
            if (obj.type === 'Success') {
              this.success(obj.text);
            } else if (obj.type === 'Error') {
              this.error(obj.text);
            } else if (obj.type === 'Info') {
              this.info(obj.text);
            } else if (obj.type === 'Warning') {
              this.warning(obj.text);
            }
          }
        }
      }

    });

    this.systemModuleService.loadingAnnounced$.subscribe((value: any) => {
      if (value.status === 'On') {
        this.loadingService.start();
      } else {
        this.loadingService.complete();
      }
    })
  }
  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.auth = <any>this.locker.getObject('auth');
  }
  success(text) {
    this.toastr.success(text, 'Success!');
  }
  error(text) {
    this.toastr.error(text, 'Error!');
  }
  info(text) {
    this.toastr.info(text, 'Info');
  }
  warning(text) {
    this.toastr.warning(text, 'Warning');
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
}
