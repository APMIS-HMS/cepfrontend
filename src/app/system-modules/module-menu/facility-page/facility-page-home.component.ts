import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-facility-page-home',
  templateUrl: './facility-page-home.component.html',
  styleUrls: ['./facility-page-home.component.scss']
})
export class FacilityPageHomeComponent implements OnInit {
  loadIndicatorVisible = false;
  contentSecMenuShow = false;
  pageInView = '';
  homeContentArea = false;
  modulesContentArea = false;
  contentSecMenuToggle = false;
  optionsContentArea = false;
  departmentsContentArea = false;
  locationsContentArea = false;
  workspaceContentArea = false;
  professionContentArea = false;
  constructor(private router: Router) {
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
  }
  changeRoute(value: string) {
    this.router.navigate(['/modules/setup/' + value]);
  }
}
