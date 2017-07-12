import { Component, ViewContainerRef } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { FacilitiesService } from './services/facility-manager/setup/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolSessionStorage } from 'angular2-cool-storage';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loadIndicatorVisible = true;
  constructor(router: Router, private vcr: ViewContainerRef, private toastr: ToastsManager,
    private facilityService: FacilitiesService, private locker: CoolSessionStorage) {
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
            }
          }
        }
      }

    });
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
}
