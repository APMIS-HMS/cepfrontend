import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FacilitiesService, EmployeeService } from '../../../services/facility-manager/setup/index';
import { Employee, Facility } from '../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { PatientmanagerHomepageComponent } from './patientmanager-homepage/patientmanager-homepage.component'

@Component({
  selector: 'app-patient-manager',
  templateUrl: './patient-manager.component.html',
  styleUrls: ['./patient-manager.component.scss']
})
export class PatientManagerComponent implements OnInit, AfterViewInit {
  @ViewChild(PatientmanagerHomepageComponent)
  private patientManagerComponent: PatientmanagerHomepageComponent;
  homeContentArea = true;
  employeeDetailArea = false;
  newEmp = false;
  patient: any;
  resetData:Boolean = false;

  searchControl = new FormControl();

  pageInView = 'Patient Manager';

  facilityObj = {
    'logo': 'assets/images/logos/red.jpg'
  };

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private _locker: CoolLocalStorage,
    public facilityService: FacilitiesService,
		private _employeeService: EmployeeService
  ) { }

  ngAfterViewInit() {
    this.searchControl.valueChanges.subscribe(searchText => {
      this.patientManagerComponent.searchPatients(searchText);
    });
  }
  ngOnInit() {
    this.searchControl.valueChanges.subscribe(value => {
      // do something with value here
    });
    this.route.params.subscribe(params => {
    })
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
  resetDataLoader(data){
    this.resetData = data;
  }
  close_onClick(e) {
    this.newEmp = false;
  }
  pageInViewLoader(title) {
    this.pageInView = title;
  }
  empDetailShow(val) {
    this.homeContentArea = false;
    this.employeeDetailArea = true;
    this.patient = val;
  }
  HomeContentArea_show() {
    this.homeContentArea = true;
    this.employeeDetailArea = false;
    this.pageInView = 'Patient Manager';
  }

}
