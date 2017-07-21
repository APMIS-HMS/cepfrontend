import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {
  CountriesService, FacilitiesService, UserService,
  PersonService, EmployeeService, GenderService, RelationshipService, MaritalStatusService,
} from '../../services/facility-manager/setup/index';
import { Facility, User, Employee, Person, Country, Gender, Relationship, MaritalStatus } from '../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router'

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
  constructor(private countryService: CountriesService,
    private router: Router,
    private employeeService: EmployeeService,
    private facilityService: FacilitiesService,
    private userService: UserService,
    private personService: PersonService,
    private genderService: GenderService,
    private relationshipService: RelationshipService,
    private maritalStatusService: MaritalStatusService,
    private locker: CoolSessionStorage) {

  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    const loginEmployee = this.locker.getObject('loginEmployee');
    this.departments = this.selectedFacility.departments;
    this.departments.forEach((item, i) => {
      this.unitCount = this.unitCount + item.units.length;
      item.units.forEach((itemu, u) => {
        this.clinicCount = this.clinicCount + itemu.clinics.length;
      })
    })
  }

  navigateToClinic() {
    this.router.navigate(['/dashboard/clinic']);
  }
}
