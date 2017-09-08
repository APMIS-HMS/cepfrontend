import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService, FacilitiesService, WorkbenchService } from '../../services/facility-manager/setup/index';
import { Employee } from '../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

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
  checkInBtnText: String = '<i class="fa fa-check-circle"></i> Check In';

  constructor(
    private _fb: FormBuilder,
		private _locker: CoolLocalStorage,
		public facilityService: FacilitiesService,
    private _employeeService: EmployeeService,
    private _workbenchService: WorkbenchService
  ) {}

  ngOnInit() {
    this.loginEmployee = <Employee>this._locker.getObject('loginEmployee');
    this.labCheckin = this._fb.group({
      location: ['', [<any>Validators.required]],
      workbench: ['', [<any>Validators.required]],
      isDefault: [false, [<any>Validators.required]]
    });

    if (!!this.loginEmployee.workSpaces) {
      console.log(this.loginEmployee.workSpaces);
			this.loginEmployee.workSpaces.forEach(workspace => {
        if (workspace.isActive && workspace.locations.length > 0) {
          workspace.locations.forEach(x => {
            console.log(x);
            if (x.isActive && new RegExp('lab', 'i').test(x.majorLocationId.name)) {
              this.locations.push(x.minorLocationId);
            }
          });
        }
      });
    }

		this.labCheckin.controls['location'].valueChanges.subscribe(val => {
      console.log(val);
      this._workbenchService.find({ query: { 'laboratoryId._id': val._id } }).then(res => {
        console.log(res);
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
    if (!!this.loginEmployee.workbenchCheckIn && this.loginEmployee.workbenchCheckIn.length > 0) {
      this.loginEmployee.workbenchCheckIn.forEach((item, i) => {
        item.isOn = false;
        if (value.isDefault === true) {
          item.isDefault = false;
        }
      });
    }

    this.loginEmployee.workbenchCheckIn.push(checkIn);
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
      this.checkInBtnText = '<i class="fa fa-check-circle"></i> Check In';
      this.close_onClick();
    });
  }

  close_onClick() {
		this.closeModal.emit(true);
	}

	changeRoom(checkIn: any) {
		let keepCheckIn;
		this.loginEmployee.workbenchCheckIn.forEach((item, i) => {
			item.isOn = false;
			if (item._id === checkIn._id) {
				item.isOn = true;
				keepCheckIn = item;
			}
		});
		this._employeeService.update(this.loginEmployee).then(res => {
			this.loginEmployee = res;
			this._employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'workbench' });
			this.close_onClick();
		});
	}

}
