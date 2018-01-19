import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FeatureModuleService } from '../../../../services/module-manager/setup/index';
import { AccessControlService } from '../../../../services/facility-manager/setup/index';

import { FeatureModule, AccessControl, FeatureModuleViewModel, FacilityModule, Facility, Address, Profession, Relationship, Employee, Person, MaritalStatus, Department, MinorLocation, Gender, Title, Country } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-access-role-details',
    templateUrl: './access-role-details.component.html',
    styleUrls: ['./access-role-details.component.scss']
  })
  
export class AccessRoleDetailsComponent implements OnInit {

        constructor() { }
      
        ngOnInit() {
        }
      
  }