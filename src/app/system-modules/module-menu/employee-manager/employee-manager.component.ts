import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService, FacilitiesService } from '../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { EmployeemanagerHomepageComponent } from './employeemanager-homepage/employeemanager-homepage.component'
import { Facility } from '../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
@Component({
  selector: 'app-employee-manager',
  templateUrl: './employee-manager.component.html',
  styleUrls: ['./employee-manager.component.scss']
})
export class EmployeeManagerComponent implements OnInit, AfterViewInit {
  @ViewChild(EmployeemanagerHomepageComponent)
  private employeeManagerComponent: EmployeemanagerHomepageComponent;
  homeContentArea = true;
  employeeDetailArea = false;
  assignUnitPop = false;
  newEmp = false;
  mobileSort = false;
  employee: any;
  selectedFacility: any = <any>{};
  resetData:Boolean = false;

  searchControl = new FormControl();
  department = new FormControl();
  unit = new FormControl();

  pageInView = 'Home';

  departments: any[] = [];
  units: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private employeeService: EmployeeService,
    private locker: CoolLocalStorage, private systemService:SystemModuleService) { }
  ngAfterViewInit() {
    this.searchControl.valueChanges
    .debounceTime(400)
    .distinctUntilChanged()
    .subscribe(searchText => {
      console.log(searchText);
      this.employeeManagerComponent.searchEmployees(searchText);
    });
  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.departments = this.selectedFacility.departments;
    this.department.valueChanges.subscribe(value => {
      this.units = value.units;
      console.log(value);
      this.employeeManagerComponent.getByDepartment(value._id);
    });
    this.unit.valueChanges.subscribe(value => {
      const department = this.department.value;
      this.employeeManagerComponent.getByUnit(department._id, value._id);
    });
    // this.employeeService.find({
    //   query: {
    //     facilityId: this.selectedFacility._id, showbasicinfo: true
    //   }
    // }).then((payload: any) => {
    //   console.log(payload);
    // });
  }

  navEpHome() {
    this.homeContentArea = true;
    this.employeeDetailArea = false;
  }
  newEmpShow() {
    this.newEmp = true;
  }
  reset(){
    this.resetData = true;
  }
  close_onClick(e) {
    this.newEmp = false;
    this.assignUnitPop = false;
  }
  pageInViewLoader(title) {
    this.pageInView = title;
  }
  resetDataLoader(data){
    this.resetData = data;
    console.log(this.resetData);
  }
  empDetailShow(val) {
    this.homeContentArea = false;
    this.employeeDetailArea = true;
    this.employee = val;
  }
  assignUnit_pop() {
    this.assignUnitPop = true;
    this.employee = undefined;
  }
  HomeContentArea_show() {
    this.homeContentArea = true;
    this.employeeDetailArea = false;
    this.pageInView = 'Employee Manager';
  }
  sort_pop(){
    this.mobileSort = !this.mobileSort;
  }
}
