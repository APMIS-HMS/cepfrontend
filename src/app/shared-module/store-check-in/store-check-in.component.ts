import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultingRoomService, EmployeeService, FacilitiesService, StoreService } from '../../services/facility-manager/setup/index';
import { ConsultingRoomModel, Employee, Facility } from '../../models/index';
import { ClinicHelperService } from '../../system-modules/module-menu/clinic/services/clinic-helper.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { LocationService } from '../../services/module-manager/setup';

@Component({
	selector: 'app-store-check-in',
	templateUrl: './store-check-in.component.html',
	styleUrls: ['./store-check-in.component.scss']
})
export class StoreCheckInComponent implements OnInit {
	mainErr = true;
	errMsg = 'You have unresolved errors';
	@Input() loginEmployee: any;
	@Input() workSpace: any;
	workSpaces: any;
	isLoading = false;
	public storeCheckin: FormGroup;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  selectedStore: ConsultingRoomModel = <ConsultingRoomModel>{};
  selectedFacility: Facility = <Facility>{};
	stores: any[] = [];
	locations: any[] = [];
  checkInBtn = true;
  checkingInBtn = false;
  disableBtn = false;
  checkInBtnText: any;

	constructor(
    public formBuilder: FormBuilder,
    private _locker: CoolLocalStorage,
		public clinicHelperService: ClinicHelperService,
    public facilityService: FacilitiesService,
    private _locationService: LocationService,
		public consultingRoomService: ConsultingRoomService,
		public employeeService: EmployeeService,
		public storeService: StoreService,
		public locker: CoolLocalStorage,
		private _authFacadeService: AuthFacadeService
	) {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this._getLabLocation();
		// this.workSpaces = this.locker.getObject('workspaces');
		// this._authFacadeService.getLogingEmployee().then((res: any) => {
		// 	this.loginEmployee = res;
		// 	this.workSpaces = res.workSpaces;
		// 	if (this.workSpaces !== undefined) {
		// 		this.workSpaces.forEach(workspace => {
		// 			if (workspace.isActive && workspace.locations.length > 0) {
		// 				workspace.locations.forEach(x => {
    //           console.log(x);
		// 					if (x.isActive) {
		// 						this.locations.push(x.minorLocationObject);
		// 					}
    //         });
    //         // workspace.locations.forEach(x => {
    //         //   if (x.isActive && x.majorLocationId.name === 'Ward') {
    //         //     this.locations.push(x.majorLocationId);
    //         //   }
    //         // });
		// 			}
		// 		});
		// 	}
		// }).catch(err => {});
	}

	ngOnInit() {
		this.storeCheckin = this.formBuilder.group({
			location: ['', [<any>Validators.required]],
			room: ['', [<any>Validators.required]],
			isDefault: [false, [<any>Validators.required]]
		});
		this.storeCheckin.controls['location'].valueChanges.subscribe(value => {
			this.storeService.find({ query: { minorLocationId: value } }).then(res => {
        console.log(res);
				if (res.data.length > 0) {
					this.stores = res.data;
				} else {
					this.stores = [];
				}
			});
    });

		this.storeCheckin.controls['room'].valueChanges.subscribe(value => {
		});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}

	checkIn(valid, value) {
    this.checkInBtn = false;
    this.checkingInBtn = true;
    this.disableBtn = true;
		const checkIn: any = <any>{};
		checkIn.minorLocationId = value.location;
		checkIn.storeId = value.room._id;
    checkIn.storeObject = { name: value.room.name, _id: value.room._id, minorLocationId: value.room.minorLocationId };
		checkIn.lastLogin = new Date();
		checkIn.isOn = true;
    checkIn.isDefault = value.isDefault;

		if (this.loginEmployee.storeCheckIn === undefined) {
			this.loginEmployee.storeCheckIn = [];
		}
		this.loginEmployee.storeCheckIn.forEach((itemi, i) => {
			itemi.isOn = false;
			if (value.isDefault === true) {
				itemi.isDefault = false;
			}
		});

		this.loginEmployee.storeCheckIn.push(checkIn);
		this.employeeService.update(this.loginEmployee).then(payload => {
			this.loginEmployee = payload;
			let keepCheckIn;
			this.loginEmployee.storeCheckIn.forEach((itemi, i) => {
				itemi.isOn = false;
				if (itemi.storeId === checkIn.storeId) {
					itemi.isOn = true;
					keepCheckIn = itemi;
				}
			});

			this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'store' });
      this.checkInBtn = true;
      this.checkingInBtn = false;
      this.disableBtn = true;
			this.close_onClick();
		});
  }

  private _getLabLocation() {
    this._locationService.find({ query: { name: 'Pharmacy' } }).then(res => {
      if (res.data.length > 0) {
        this._getEmployee(res.data[0]._id);
      }
    }).catch(err => {});
  }

  private _getEmployee(pharmId: string) {
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      this.loginEmployee = res;
      if (!!this.loginEmployee.workSpaces && this.loginEmployee.workSpaces.length > 0) {
        if (!!this.selectedFacility.minorLocations && this.selectedFacility.minorLocations.length > 0) {
          const minorLocations = this.selectedFacility.minorLocations;
          const locations = this.loginEmployee.workSpaces.map(m => m.locations);
          const locationIds = [];
          locations.forEach(location => {
            (location.map(m => m.minorLocationId)).forEach(p => { locationIds.push(p) });
          });
          this.locations = minorLocations.filter(x => x.locationId === pharmId && locationIds.includes(x._id));
        }
      }
    }).catch(err => {});
  }

	changeRoom(checkIn: any) {
		let keepCheckIn;
		this.loginEmployee.storeCheckIn.forEach((itemi, i) => {
			itemi.isOn = false;
			if (itemi._id === checkIn._id) {
				itemi.isOn = true;
				keepCheckIn = itemi;
			}
		});
		this._authFacadeService.getCheckedInEmployee(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn }).then(payload => {
			this.loginEmployee = payload;
			this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'store' });
			this.close_onClick();
		});
	}
}
