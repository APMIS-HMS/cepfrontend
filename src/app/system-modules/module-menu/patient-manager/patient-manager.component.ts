import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientmanagerHomepageComponent } from './patientmanager-homepage/patientmanager-homepage.component';
import {
  PatientService, PersonService, FacilitiesService, FacilitiesServiceCategoryService,
  HmoService, GenderService, RelationshipService, CountriesService, TitleService
} from '../../../services/facility-manager/setup/index';
import {
  Facility, MinorLocation, Investigation, InvestigationModel, Employee,
  BillIGroup, BillItem, BillModel, PendingLaboratoryRequest, User
} from '../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';


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

  selectedFacility;

  searchControl = new FormControl();

  searchedPatients;

  pageInView = 'Patient Manager';

  facilityObj = {
    'logo': 'assets/images/logos/red.jpg'
  };

  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private patientService: PatientService,
    private locker: CoolLocalStorage) { }

  ngAfterViewInit() {
    /* this.searchControl.valueChanges.subscribe(searchText => {
      this.patientManagerComponent.searchPatients(searchText);
    }); */
  }
  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    
    this.searchControl.valueChanges
    .debounceTime(200)
    .distinctUntilChanged()
    .subscribe(value => {
      console.log(value);
      this.patientService.findPatient({
        query: {
          'facilityId': this.selectedFacility._id,
          'searchText': value,
          'patientTable': true
        }
      }).then(payload => {
        this.searchedPatients = payload.data;
        console.log(this.searchedPatients);
      });
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
