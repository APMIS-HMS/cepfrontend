import { Component, ViewContainerRef } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loadIndicatorVisible: boolean = true;
  constructor(router: Router, private vcr: ViewContainerRef, private toastr:ToastsManager) {
    // router.events.subscribe((routerEvent: Event) => {
    //   this.checkRouterEvent(routerEvent);
    // });
    this.toastr.setRootViewContainerRef(vcr);
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
