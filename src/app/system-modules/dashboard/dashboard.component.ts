import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {
  CountriesService, FacilitiesService, UserService,
  PersonService, EmployeeService, GenderService, RelationshipService, MaritalStatusService, WorkSpaceService,
} from '../../services/facility-manager/setup/index';
import { Facility, User, Employee, Person, Country, Gender, Relationship, MaritalStatus } from '../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router'
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  selectedFacility: Facility = <Facility>{};
  departments: any[] = [];
  unitCount: any = 0
  clinicCount: any = 0;

  facilityObj:any;
  checkedInObject:any;
  loginEmployee:any;
  loadIndicatorVisible:any;
  subscription:Subscription;
  ;
  constructor(private countryService: CountriesService,
    private router: Router,
    private employeeService: EmployeeService,
    private facilityService: FacilitiesService,
    private userService: UserService,
    private personService: PersonService,
    private genderService: GenderService,
    private relationshipService: RelationshipService,
    private maritalStatusService: MaritalStatusService,
    private workSpaceService:WorkSpaceService,
    private locker: CoolLocalStorage) {

  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    const loginEmployee = this.locker.getObject('loginEmployee');
    this.departments = this.selectedFacility.departments;
    // this.departments.forEach((item, i) => {
    //   this.unitCount = this.unitCount + item.units.length;
    //   item.units.forEach((itemu, u) => {
    //     this.clinicCount = this.clinicCount + itemu.clinics.length;
    //   })
    // })
    this.primeApp();
  }

  primeApp(){
    this.facilityObj = <Facility>this.facilityService.getSelectedFacilityId();
    if (this.facilityObj !== undefined && this.facilityObj != null) {
    }
    this.employeeService.checkInAnnounced$.subscribe(payload => {
      this.checkedInObject = payload;
    });
    this.facilityService.listner.subscribe(pay => {
      // this.facilityName = pay.name;
    })
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    console.log(this.loginEmployee)
    const auth = <any>this.locker.getObject('auth');
    if (this.loginEmployee !== null && this.loginEmployee._id !== undefined && auth.data.personId === this.loginEmployee.personId) {
      return;
    }
    this.loadIndicatorVisible = true;
    console.log(this.facilityObj._id);
    console.log(auth.data.personId)
    const emp$ = Observable.fromPromise(this.employeeService.find({
      query: {
        facilityId: this.facilityObj._id, personId: auth.data.personId, $select:[]
      }
    }));
    this.subscription = emp$.mergeMap((emp: any) => {
      console.log(emp)
      if (emp.data.length > 0) {
        return Observable.forkJoin(
          [
            Observable.fromPromise(this.employeeService.get(emp.data[0]._id, {})),
            Observable.fromPromise(this.workSpaceService.find({ query: { 'employeeId._id': emp.data[0]._id } })),
            Observable.fromPromise(this.facilityService
              .find({
                query: {
                  '_id': this.facilityObj._id,
                  $select: ['name', 'email', 'contactPhoneNo', 'contactFullName', 'shortName', 'website', 'logoObject']
                }
              }))
          ])
      } else {
        this.loadIndicatorVisible = false;
        return Observable.of({})
      }
    }
    ).subscribe((results: any) => {
      console.log(results);
      if (results[0] !== undefined) {
        this.loginEmployee = results[0];
        console.log(this.loginEmployee)
        this.loginEmployee.workSpaces = results[1].data;
        this.locker.setObject('workspaces', this.loginEmployee.workSpaces)

        if (results[2].data.length > 0) {
          this.locker.setObject('miniFacility', results[2].data[0])
        }

        this.locker.setObject('loginEmployee', this.loginEmployee);
      }

      this.loadIndicatorVisible = false;
      console.log('can move')
    })
  }

  navigateToClinic() {
    this.router.navigate(['/dashboard/clinic']);
  }
}
