import { Component, OnInit, Input, Output } from '@angular/core';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Facility, User, Person } from '../../../../../models/index';
import { 
  FacilitiesService, PersonService
 } from '../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {

  constructor(
		private _locker: CoolSessionStorage,
    private _facilityService: FacilitiesService,
    private _personService: PersonService
  ) { }

  ngOnInit() {
    this._personService.receivePerson().subscribe(val => {
      console.log(val);
    });
  }

}
