import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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

  constructor(private router: Router, private route: ActivatedRoute) { }

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
      //console.log(params);
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
    console.log(this.resetData);
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
