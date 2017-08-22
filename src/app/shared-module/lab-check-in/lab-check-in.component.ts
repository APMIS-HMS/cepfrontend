import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService, FacilitiesService, WorkbenchService } from '../../services/facility-manager/setup/index';
import { Employee } from '../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-lab-check-in',
  templateUrl: './lab-check-in.component.html',
  styleUrls: ['./lab-check-in.component.scss']
})
export class LabCheckInComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() loginEmployee: Employee;
  @Input() workSpace: any;
  labCheckin: FormGroup;
  mainErr = true;
	errMsg = 'You have unresolved errors';
	workbenches: any[] = [];
	locations: any[] = [];
  loadIndicatorVisible = false;
  checkInBtnText: string = '<i class="fa fa-check-circle"></i> Check In';

  constructor(
    private _fb: FormBuilder,
		private _locker: CoolSessionStorage,
		public facilityService: FacilitiesService,
    private _employeeService: EmployeeService,
    private _workbenchService: WorkbenchService
  ) {}

  ngOnInit() {
    this.loginEmployee = <Employee>this._locker.getObject('loginEmployee');
    console.log(this.loginEmployee);
    this.labCheckin = this._fb.group({
      location: ['', [<any>Validators.required]],
      workbench: ['', [<any>Validators.required]],
      isDefault: [false, [<any>Validators.required]]
    });

    if (!!this.loginEmployee.workSpaces) {
			this.loginEmployee.workSpaces.forEach(workspace => {
        console.log(workspace);
        if(workspace.isActive && workspace.locations.length > 0) {
          workspace.locations.forEach(x => {
            if(x.isActive && new RegExp('laboratory', "i").test(x.majorLocationId.name)) {
              this.locations.push(x.minorLocationId);
            }
          });
        }
      });
    }
    
		this.labCheckin.controls['location'].valueChanges.subscribe(val => {
			this._workbenchService.find({ query: { "laboratoryId._id": val._id } }).then(res => {
				if (res.data.length > 0) {
					this.workbenches = res.data;
				} else {
					this.workbenches = [];
				}
			});
		});
  }

	checkIn(valid, value) {
    this.checkInBtnText = '<i class="fa fa-spinner fa-spin"></i> Checking in...';
		const checkIn: any = <any>{};
		checkIn.minorLocationId = value.location._id;
		checkIn.minorLocationObject = value.location;
		checkIn.workbenchId = value.workbench._id;
		checkIn.workbenchObject = value.workbench;
		checkIn.lastLogin = new Date();
		checkIn.isOn = true;
		checkIn.isDefault = value.isDefault;
		if (this.loginEmployee.workbenchCheckIn === undefined) {
			this.loginEmployee.workbenchCheckIn = [];
    }
    // Set to false any existing workbench that is set to true.
    if(!!this.loginEmployee.workbenchCheckIn && this.loginEmployee.workbenchCheckIn.length > 0) {
      this.loginEmployee.workbenchCheckIn.forEach((item, i) => {
        item.isOn = false;
        if (value.isDefault === true) {
          item.isDefault = false;
        }
      });
    }
    
    this.loginEmployee.workbenchCheckIn.push(checkIn);
    this.loadIndicatorVisible = true;
    this._employeeService.update(this.loginEmployee).then(res => {
      this.loginEmployee = res;
      const workspaces = <any>this._locker.getObject('workspaces');
      this.loginEmployee.workSpaces = workspaces;
      this._locker.setObject('loginEmployee', res);
      let keepCheckIn;
      this.loginEmployee.workbenchCheckIn.forEach((item, i) => {
        item.isOn = false;
        if (item.workbenchId === checkIn.workbenchId) {
          item.isOn = true;
          keepCheckIn = item;
        }
      });

      this._employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'workbench' });
      this.loadIndicatorVisible = false;
      this.checkInBtnText = '<i class="fa fa-check-circle"></i> Check In';
      this.close_onClick();
    });
  }

  close_onClick() {
		this.closeModal.emit(true);
	}
  
	// changeRoom(checkIn: any) {
	// 	let keepCheckIn;
	// 	this.loginEmployee.storeCheckIn.forEach((itemi, i) => {
	// 		itemi.isOn = false;
	// 		if (itemi._id === checkIn._id) {
	// 			itemi.isOn = true;
	// 			keepCheckIn = itemi;
	// 		}
	// 	});
	// 	this._employeeService.update(this.loginEmployee).then(payload => {
	// 		this.loginEmployee = payload;
	// 		this._employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'store' });
	// 		this.close_onClick();
	// 	});
	// }

}
