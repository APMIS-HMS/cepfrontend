import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService, FacilitiesService } from '../../../services/facility-manager/setup/index';
import { Locker } from 'angular2-locker';
import { EmployeemanagerHomepageComponent } from './employeemanager-homepage/employeemanager-homepage.component'

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
  employee: any;
  selectedFacility: any = <any>{};

  searchControl = new FormControl();
  department = new FormControl();
  unit = new FormControl();

  pageInView = 'Home';

  departments: any[] = [];
  units: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private employeeService: EmployeeService,
    private locker: Locker) { }
  ngAfterViewInit() {
    this.searchControl.valueChanges.subscribe(searchText => {
      this.employeeManagerComponent.searchEmployees(searchText);
    });
  }

  ngOnInit() {
    this.selectedFacility = this.locker.get('selectedFacility');
    this.departments = this.selectedFacility.departments;
    this.department.valueChanges.subscribe(value => {
      this.units = value.units;
      this.employeeManagerComponent.getByDepartment(value._id);
    });
    this.unit.valueChanges.subscribe(value => {
      let department = this.department.value;
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
  close_onClick(e) {
    this.newEmp = false;
    this.assignUnitPop = false;
  }
  pageInViewLoader(title) {
    this.pageInView = title;
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
}