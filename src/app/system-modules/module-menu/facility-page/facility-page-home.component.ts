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
    const page: string = this.router.url;
    console.log(page);
    this.checkPageUrl(page);
    
    this.selectedFacility = <any>this.locker.getObject('selectedFacility');
    this.getModules();
    this.getDepartments();
    this.getUnits();
    this.getMinorLocations();
    this.getEmployees();
  }
  changeRoute(value: string) {
    this.router.navigate(['/dashboard/facility/' + value]);

    if(value == ''){
      this.homeContentArea = true;
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
    } else if(value == 'modules'){
      this.homeContentArea = false;
      this.modulesContentArea = true;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
    } else if(value == 'departments'){
      this.homeContentArea = false;
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = true;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
    } else if(value == 'locations'){
      this.homeContentArea = false;
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = true;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
    } else if(value == 'workspaces'){
      this.homeContentArea = false;
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = true;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
    } else if(value == 'options'){
      this.homeContentArea = false;
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = true;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
    } else if(value == 'profession'){
      this.homeContentArea = false;
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = true;
      // this.dashboardContentArea = false;
    }
  }
  getModules() {
    this.hasModules = this.selectedFacility.facilitymoduleId.length > 0 ? true : false
    console.log(this.selectedFacility);
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
    this.employeeService.find({ query: { $limit: 1 } }).then(payload => {
      if (payload.data.length > 0) {
        this.hasAssignedEmployees = true;
      }
    })
  }

  private checkPageUrl(param: string) {
		if (param.includes('facility/modules')) {
			this.homeContentArea = false;
      this.modulesContentArea = true;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
		} else if (param.includes('facility/departments')) {
			this.homeContentArea = false;
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = true;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
		} else if (param.includes('facility/locations')) {
			this.homeContentArea = false;
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = true;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
		} else if (param.includes('facility/workspaces')) {
			this.homeContentArea = false;
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = true;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
		} else if (param.includes('facility/options')) {
			this.homeContentArea = false;
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = true;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
		} else if (param.includes('facility/profession')) {
			this.homeContentArea = false;
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = true;
      // this.dashboardContentArea = false;
		} else if (param.includes('facility')) {
			this.homeContentArea = true;
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
		}
	}
 
}
