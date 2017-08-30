import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  FacilitiesService, InvestigationService, TemplateService
} from '../../../../../services/facility-manager/setup/index';
import { Facility, User } from '../../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-select-template',
  templateUrl: './select-template.component.html',
  styleUrls: ['./select-template.component.scss']
})
export class SelectTemplateComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() template: EventEmitter<any> = new EventEmitter<any>();
  templateFormGroup: FormGroup;
  facility: Facility = <Facility>{};
  miniFacility: Facility = <Facility>{};
  user: User = <User>{};
  investigations: any = <any>[];
  templates: any = <any>[];

  constructor(
    private _fb: FormBuilder,
    private _locker: CoolSessionStorage,
    private _facilityService: FacilitiesService,
    private _templateService: TemplateService
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.miniFacility = <Facility>this._locker.getObject('miniFacility');
    this.user = <User>this._locker.getObject('auth');

    this.templateFormGroup = this._fb.group({
      investigation: ['', [Validators.required]],
    });

    this.templateFormGroup.controls['investigation'].valueChanges.subscribe(val => {
      console.log(val);
    });

    this._getAllTemplates();
  }

  selectTemplate(valid: boolean, value: any) {
    if (valid) {
      this.template.emit(value);
    } else {
      this._notification('Error', 'Some fields are empty. Please fill in all required fields.');
    }
  }

  private _getAllTemplates() {
    this._templateService.find({query: { 'facility._id': this.facility._id }}).then(res => {
      console.log(res);
      this.investigations = res.data;
    }).catch(err => console.log(err));
  }

  // Notification
  private _notification(type: String, text: String): void {
    this._facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
}
