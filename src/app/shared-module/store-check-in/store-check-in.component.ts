import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConsultingRoomService, EmployeeService, FacilitiesService, StoreService } from '../../services/facility-manager/setup/index';
import { ConsultingRoomModel, Employee } from '../../models/index';
import { ClinicHelperService } from '../../system-modules/module-menu/clinic/services/clinic-helper.service';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
	selector: 'app-store-check-in',
	templateUrl: './store-check-in.component.html',
	styleUrls: ['./store-check-in.component.scss']
})
export class StoreCheckInComponent implements OnInit {

	mainErr = true;
	errMsg = 'You have unresolved errors';
	@Input() loginEmployee: Employee;
	@Input() workSpace: any;

	public storeCheckin: FormGroup;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	selectedStore: ConsultingRoomModel = <ConsultingRoomModel>{};
	stores: any[] = [];
	locations: any[] = [];
	loadIndicatorVisible = false;
	constructor(public formBuilder: FormBuilder,
		public clinicHelperService: ClinicHelperService,
		public facilityService: FacilitiesService,
		public consultingRoomService: ConsultingRoomService,
		public employeeService: EmployeeService,
		public storeService: StoreService,
		public locker: CoolSessionStorage
	) {
		this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
	}

	ngOnInit() {
		if (this.loginEmployee.workSpaces !== undefined) {
			this.loginEmployee.workSpaces.forEach(work => {
				work.locations.forEach(loc => {
					this.locations.push(loc.minorLocationId);
				})
			})

		}

		this.storeCheckin = this.formBuilder.group({
			location: ['', []],
			room: ['', []],
			isDefault: [false, []]
		});
		this.storeCheckin.controls['location'].valueChanges.subscribe(value => {
			this.storeService.find({ query: { minorLocationId: value } }).then(payload => {
				if (payload.data.length > 0) {
					this.stores = payload.data;
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
		const checkIn: any = <any>{};
		checkIn.minorLocationId = value.location;
		checkIn.storeId = value.room;
		console.log(value)
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
		this.loadIndicatorVisible = true;
		this.employeeService.update(this.loginEmployee).then(payload => {
			this.loginEmployee = payload;
			// this.locker.setObject('loginEmployee', payload);
			console.log(this.loginEmployee.storeCheckIn)
			console.log(checkIn)
			let keepCheckIn;
			this.loginEmployee.storeCheckIn.forEach((itemi, i) => {
				itemi.isOn = false;
				if (itemi.storeId === checkIn.storeId) {
					itemi.isOn = true;
					keepCheckIn = itemi;
					console.log('is correct')
				}
			});


			this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'store' });
			this.loadIndicatorVisible = false;
			console.log('sent from store checkin')
			this.close_onClick();
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
		this.employeeService.update(this.loginEmployee).then(payload => {
			this.loginEmployee = payload;
			this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'store' });
			this.close_onClick();
		});
	}
}
