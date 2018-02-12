import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultingRoomService, EmployeeService, FacilitiesService, StoreService } from '../../services/facility-manager/setup/index';
import { ConsultingRoomModel, Employee } from '../../models/index';
import { ClinicHelperService } from '../../system-modules/module-menu/clinic/services/clinic-helper.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';

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
	stores: any[] = [];
	locations: any[] = [];
	// loadIndicatorVisible = false;
	checkInBtnText: String = '<i class="fa fa-check-circle"></i> Check In';
	constructor(
		public formBuilder: FormBuilder,
		public clinicHelperService: ClinicHelperService,
		public facilityService: FacilitiesService,
		public consultingRoomService: ConsultingRoomService,
		public employeeService: EmployeeService,
		public storeService: StoreService,
		public locker: CoolLocalStorage,
		private _authFacadeService: AuthFacadeService
	) {
		// this.workSpaces = this.locker.getObject('workspaces');
		this.isLoading = true;
		this._authFacadeService.getLogingEmployee().then((res: any) => {
			console.log(res);
			this.loginEmployee = res;
			this.workSpaces = res.workSpaces;
			if (this.workSpaces !== undefined) {
				this.workSpaces.forEach(workspace => {
					console.log(workspace);
					if (workspace.isActive && workspace.locations.length > 0) {
						workspace.locations.forEach(p => {
							console.log(p);
							if (p.isActive) {
								let index = this.locations.filter(x => x.minorLocationId.toString() === p.minorLocationId.toString());
								if (index.length == 0) {
									this.locations.push(p);
								}
							}
						});
					}
				});
				this.isLoading = false;
			}
			console.log(this.locations);
		}).catch(err => console.log(err));
	}

	ngOnInit() {
		this.storeCheckin = this.formBuilder.group({
			location: ['', [<any>Validators.required]],
			room: ['', [<any>Validators.required]],
			isDefault: [false, [<any>Validators.required]]
		});
		this.storeCheckin.controls['location'].valueChanges.subscribe(value => {
			console.log(value);
			this.storeService.find({ query: { minorLocationId: value } }).then(res => {
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
		console.log(value);
		this.checkInBtnText = '<i class="fa fa-spinner fa-spin"></i> Checking in...';
		const checkIn: any = <any>{};
		checkIn.minorLocationId = value.location;
		checkIn.storeId = value.room;
		checkIn.lastLogin = new Date();
		checkIn.isOn = true;
		checkIn.isDefault = value.isDefault;
		if (this.loginEmployee.storeCheckIn === undefined) {
			console.log(1);
			this.loginEmployee.storeCheckIn = [];
		}
		this.loginEmployee.storeCheckIn.forEach((itemi, i) => {
			console.log(i);
			itemi.isOn = false;
			if (value.isDefault === true) {
				itemi.isDefault = false;
			}
		});

		this.loginEmployee.storeCheckIn.push(checkIn);
		console.log(2);
		// this.loadIndicatorVisible = true;
		console.log(this.loginEmployee);
		this._authFacadeService.getCheckedInEmployee(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn }).then(payload => {
			console.log(payload);
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
			this.checkInBtnText = '<i class="fa fa-check-circle"></i> Check In';
			console.log(this.loginEmployee.storeCheckIn);
		});
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
