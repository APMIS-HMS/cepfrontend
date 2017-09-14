import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { Employee, Facility, User } from '../../../../models/index';
import { ClinicHelperService } from '../../../../system-modules/module-menu/clinic/services/clinic-helper.service';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-ward-check-in',
  templateUrl: './ward-check-in.component.html',
  styleUrls: ['./ward-check-in.component.scss']
})
export class WardCheckInComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() loginEmployee: Employee;
  @Input() workSpace: any;
  facility: Facility = <Facility>{};
  miniFacility: Facility = <Facility>{};
  user: User = <User>{};
	wardCheckin: FormGroup;
	wards: any[] = [];
	locations: any[] = [];
  checkInBtnText: String = '<i class="fa fa-check-circle"></i> Check In';

	constructor(
		public formBuilder: FormBuilder,
		public clinicHelperService: ClinicHelperService,
		public facilityService: FacilitiesService,
		public employeeService: EmployeeService,
		public locker: CoolLocalStorage
	) {

	}

	ngOnInit() {
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.facility = <Facility>this.locker.getObject('selectedFacility');
    this.miniFacility = <Facility>this.locker.getObject('miniFacility');
    this.user = <User>this.locker.getObject('auth');
		if (this.loginEmployee.workSpaces !== undefined) {
			this.loginEmployee.workSpaces.forEach(workspace => {
				if (workspace.isActive && workspace.locations.length > 0) {
					workspace.locations.forEach(x => {
					  if (x.isActive && x.majorLocationId.name === 'Ward') {
						  this.locations.push(x.majorLocationId);
					  }
					});
				  }
			})

		}

		this.wardCheckin = this.formBuilder.group({
			location: ['', [<any>Validators.required]],
			room: ['', [<any>Validators.required]],
			isDefault: [false, [<any>Validators.required]]
    });

		this.wardCheckin.controls['location'].valueChanges.subscribe(value => {
			this.facilityService.find({ query: { '_id': this.facility._id, 'minorLocations.locationId': value._id } }).then(res => {
				if (res.data.length > 0) {
					this.wards = res.data[0].minorLocations.filter(x => x.locationId === value._id);
				}
			});
		});
	}

	checkIn(valid: Boolean, value: any) {
    if (valid) {
      this.checkInBtnText = '<i class="fa fa-spinner fa-spin"></i> Checking in...';
      const checkIn: any = <any>{};
      checkIn.majorLocationId = value.location;
      checkIn.minorLocationId = value.room;
      checkIn.lastLogin = new Date();
      checkIn.isOn = true;
      checkIn.isDefault = value.isDefault;
      if (this.loginEmployee.wardCheckIn === undefined) {
        this.loginEmployee.wardCheckIn = [];
      }
      this.loginEmployee.wardCheckIn.forEach((itemi, i) => {
        itemi.isOn = false;
        if (value.isDefault === true) {
          itemi.isDefault = false;
        }
      });
      this.loginEmployee.wardCheckIn.push(checkIn);
      this.employeeService.update(this.loginEmployee).then(payload => {
        this.loginEmployee = payload;
        const workspaces = <any>this.locker.getObject('workspaces');
        this.loginEmployee.workSpaces = workspaces;
        this.locker.setObject('loginEmployee', payload);
        let keepCheckIn;
        this.loginEmployee.wardCheckIn.forEach((itemi, i) => {
          itemi.isOn = false;
          if (itemi.minorLocationId._id === checkIn.minorLocationId._id) {
            itemi.isOn = true;
            keepCheckIn = itemi;
          }
        });
        const text = 'You have successfully checked into ' + value.room.name + ' ward';
        this._notification('Success', text);
        this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'ward' });
        this.checkInBtnText = '<i class="fa fa-check-circle"></i> Check In';
        this.close_onClick();
      });
    } else {
      this._notification('Error', 'Some fields are empty. Please fill all required fields!');
    }
  }

	changeRoom(checkIn: any) {
		let keepCheckIn;
		this.loginEmployee.wardCheckIn.forEach((itemi, i) => {
      itemi.isOn = false;
			if (itemi.minorLocationId._id === checkIn.minorLocationId._id) {
        itemi.isOn = true;
				keepCheckIn = itemi;
			}
    });

		this.employeeService.update(this.loginEmployee).then(payload => {
      this.loginEmployee = payload;
      const text = 'You have successfully changed ward to ' + checkIn.minorLocationId.name + ' ward';
      this._notification('Success', text);
			this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'ward' });
			this.close_onClick();
		});
  }

  // Notification
  private _notification(type: String, text: String): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

  close_onClick() {
    // this._notification('Error', 'Please check into a ward');
		this.closeModal.emit(true);
	}
}
