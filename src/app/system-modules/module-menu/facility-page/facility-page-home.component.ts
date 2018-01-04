import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Facility } from '../../../models/index';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EMAIL_REGEX, WEBSITE_REGEX, PHONE_REGEX, GEO_LOCATIONS } from 'app/shared-module/helpers/global-config';

import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
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

  showUnit = false;
  showLoc = false;

  selectedFacility: any;
  hasModules = false;
  hasDepartments = false;
  hasUnits = false;
  hasMinorLocations = false;
  hasAssignedEmployees = false;
  hasWorkSpaces = false;
  
  newDept = false;
  newUnit = false;
  newSubLocModal_on = false;
  createWorkspace = false;

  searchControl: FormControl = new FormControl();
  
  constructor(private formBuilder: FormBuilder, private router: Router, private locker: CoolLocalStorage, private employeeService: EmployeeService) {
    // router.events.subscribe((routerEvent: Event) => {
    //   this.checkRouterEvent(routerEvent);
    // });
  }
  ngOnInit() {
    const page: string = this.router.url;
    this.checkPageUrl(page);
    
    this.selectedFacility = <any>this.locker.getObject('selectedFacility');
    this.getModules();
    this.getDepartments();
    this.getUnits();
    this.getMinorLocations();
    this.getEmployees();
  }
  
  showUnit_click(){
    this.showUnit = true;
  }
  showUnit_hide(){
    this.showUnit = false;
  }
  showLoc_click(){
    this.showLoc = true;
  }
  showLoc_hide(){
    this.showLoc = false;
  }
  changeRoute(value: string) {
    this.router.navigate(['/dashboard/facility/' + value]);

    if(value == ''){
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = true;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
    } else if(value == 'modules'){
      this.modulesContentArea = true;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
    } else if(value == 'departments'){
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = true;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
    } else if(value == 'locations'){
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = true;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
    } else if(value == 'workspaces'){
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = true;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
    } else if(value == 'options'){
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = true;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
    } else if(value == 'profession'){
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
    // this.hasMinorLocations = this.selectedFacility.minorLocations.length > 0 ? true : false;
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
      this.modulesContentArea = true;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
		} else if (param.includes('facility/departments')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = true;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
		} else if (param.includes('facility/locations')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = true;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
		} else if (param.includes('facility/workspaces')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = true;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
		} else if (param.includes('facility/options')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = true;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
		} else if (param.includes('facility/profession')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = true;
      // this.dashboardContentArea = false;
		} else if (param.includes('facility')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = true;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      // this.dashboardContentArea = false;
		}
  }
  close_onClick(e){
    this.newDept = false;
    this.newUnit = false;
    this.newSubLocModal_on = false;
    this.createWorkspace = false;
  }
  newDept_onClick(){
    this.newDept = true;
  }
  newUnit_onClick(){
    this.newUnit = true;
  }
  newLoc_onClick(){
    this.newSubLocModal_on = true;
  }
  newWorkspace_onClick(){
    this.createWorkspace = true;
  }
  autoCompleteCallback1(selectedData:any) {
		//do any necessery stuff.
		console.log(selectedData);
	}
}
