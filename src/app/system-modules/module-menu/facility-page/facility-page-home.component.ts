import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { EmployeeService } from '../../../services/facility-manager/setup/index';
@Component({
  selector: 'app-facility-page-home',
  templateUrl: './facility-page-home.component.html',
  styleUrls: ['./facility-page-home.component.scss']
})
export class FacilityPageHomeComponent implements OnInit {
  loadIndicatorVisible = false;
  contentSecMenuShow = false;
  pageInView = 'Facility';
  homeContentArea = false;
  modulesContentArea = false;
  contentSecMenuToggle = false;
  optionsContentArea = false;
  departmentsContentArea = false;
  locationsContentArea = false;
  workspaceContentArea = false;
  professionContentArea = false;
  dashboardContentArea = false;

  selectedFacility: any;
  hasModules = false;
  hasDepartments = false;
  hasUnits = false;
  hasMinorLocations = false;
  hasAssignedEmployees = false;
  hasWorkSpaces = false;

  constructor(private router: Router, private locker: CoolSessionStorage, private employeeService: EmployeeService) {
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
    this.selectedFacility = <any>this.locker.getObject('selectedFacility');
    this.getModules();
    this.getDepartments();
    this.getUnits();
    this.getMinorLocations();
    this.getEmployees();
  }
  changeRoute(value: string) {
    this.router.navigate(['/dashboard/facility/' + value]);
  }
  getModules() {
    this.hasModules = this.selectedFacility.facilitymoduleId.length > 0 ? true : false
    console.log(this.selectedFacility)
  }
  getDepartments() {
    this.hasDepartments = this.selectedFacility.departments.length > 0 ? true : false;
  }
  getUnits() {
    if (this.selectedFacility.departments !== undefined) {
      this.selectedFacility.departments.forEach((dept, d) => {
        if (dept.units !== undefined && dept.units.length > 0) {
          this.hasUnits = true;
        }
      })
    }
  }
  getMinorLocations() {
    this.hasMinorLocations = this.selectedFacility.minorLocations.length > 0 ? true : false;
  }
  getEmployees() {
    this.employeeService.find({ query: { $limit: 1 } }).subscribe(payload => {
      if (payload.data.length > 0) {
        this.hasAssignedEmployees = true;
      }
    })
  }
}
