import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FeatureModuleService } from '../../../../services/module-manager/setup/index';
import { AccessControlService } from '../../../../services/facility-manager/setup/index';

import { Facility, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-access-role-details',
    templateUrl: './access-role-details.component.html',
    styleUrls: ['./access-role-details.component.scss']
  })

export class AccessRoleDetailsComponent implements OnInit {
  selectedFacility: Facility = <Facility>{};
  user: User = <User>{};
  roles: any = <any>[];
  loading: boolean = true;

  constructor(
    private _locker: CoolLocalStorage,
    private _router: Router,
    private _route: ActivatedRoute,
    private _accessControlService: AccessControlService
  ) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.user = <User>this._locker.getObject('auth');

    this._getAllRoles();
  }

  private _getAllRoles() {
    console.log(this.selectedFacility._id);
    this._accessControlService.find({ query: {facilityId: this.selectedFacility._id } }).then(res => {
      console.log(res);
      this.loading = false;
      if (res.data.length > 0) {
        this.roles = res.data;
      }
    }).catch(err => console.log(err));
  }
}
