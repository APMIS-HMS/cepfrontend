import { Component, OnInit, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Facility, User } from '../../../../../models/index';
import {
    FacilitiesService
} from '../../../../../services/facility-manager/setup/index';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-add-workbench',
  templateUrl: './add-workbench.component.html',
  styleUrls: ['./add-workbench.component.scss']
})
export class AddWorkbenchComponent implements OnInit {
  addWorkbench: FormGroup;
  facility: Facility = <Facility>{};
	user: User = <User>{};

  constructor(
    private _fb: FormBuilder,
    private _locker: CoolSessionStorage,
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.user = <User>this._locker.getObject('auth');
    
    this.addWorkbench = this._fb.group({
      labName: ['', [<any>Validators.required]],
      workbenchName: ['', [<any>Validators.required]]
    });
  }

}
