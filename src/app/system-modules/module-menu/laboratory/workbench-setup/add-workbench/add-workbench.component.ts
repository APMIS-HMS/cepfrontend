import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Facility, User } from '../../../../../models/index';
import {
    FacilitiesService, WorkbenchService, LaboratoryService
} from '../../../../../services/facility-manager/setup/index';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-add-workbench',
  templateUrl: './add-workbench.component.html',
  styleUrls: ['./add-workbench.component.scss']
})
export class AddWorkbenchComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  addWorkbench: FormGroup;
  facility: Facility = <Facility>{};
  user: User = <User>{};
  laboratories: any[] = [];
  workbenchBtnText: string = 'Add Workbench';
  disableWorkbenchBtn: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _locker: CoolSessionStorage,
    private _facilityService: FacilitiesService,
    private _workbenchService: WorkbenchService,
    private _laboratoryService: LaboratoryService
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.user = <User>this._locker.getObject('auth');
    
    this.addWorkbench = this._fb.group({
      labName: ['', [<any>Validators.required]],
      workbenchName: ['', [<any>Validators.required]]
    });
  }

  saveWorkbench(value: any, valid: boolean): void {
    if(valid) {
      this.disableWorkbenchBtn = true;
      this.workbenchBtnText = "Processing... <i class='fa fa-spinner fa-spin'></i>";
      console.log(value);
      console.log(valid);

      const workbench = ({
        workbench: value.workbenchName,
        labName: value.labName
      });
      console.log(workbench);
      // Save Workbench
      this._workbenchService.create(workbench)
        .then(res => {
          console.log(res);
          this.disableWorkbenchBtn = false;
          this.workbenchBtnText = "Add Workbench";
        })
        .catch(err => { console.log(err); });
    } else {
      this._notification('Info', 'Some fields are empty. Please ensure that you fill in all fields.');
    }
  }

  private _getLaboratories(): void {
    this._laboratoryService.findAll()
      .then(res => {
        console.log(res);
      })
      .catch(err => { console.log(err); });
  }

  // Notification
	private _notification(type: string, text: string): void {
		this._facilityService.announceNotification({
			users: [this.user._id],
			type: type,
			text: text
		});
  }
  
  onClickClose(e) {
		 this.closeModal.emit(true);
	}
}
