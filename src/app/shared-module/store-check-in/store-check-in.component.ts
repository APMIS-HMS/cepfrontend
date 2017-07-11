import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConsultingRoomService, EmployeeService, FacilitiesService, StoreService } from '../../services/facility-manager/setup/index';
import { ConsultingRoomModel, Employee } from '../../models/index';
import { ClinicHelperService } from '../../system-modules/module-menu/clinic/services/clinic-helper.service';

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

	constructor(public formBuilder: FormBuilder,
		public clinicHelperService: ClinicHelperService,
		public facilityService: FacilitiesService,
		public consultingRoomService: ConsultingRoomService,
		public employeeService: EmployeeService,
		public storeService: StoreService
	) { }

	ngOnInit() {
		console.log(this.loginEmployee);
		console.log(this.workSpace);
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
		checkIn.lastLogin = new Date();
		checkIn.isOn = true;
		checkIn.isDefault = value.isDefault;
		if (this.clinicHelperService.loginEmployee.storeCheckIn === undefined) {
			this.clinicHelperService.loginEmployee.storeCheckIn = [];
		}
		this.clinicHelperService.loginEmployee.storeCheckIn.forEach((itemi, i) => {
			itemi.isOn = false;
			if (value.isDefault === true) {
				itemi.isDefault = false;
			}
		});
		this.loginEmployee = this.clinicHelperService.loginEmployee;
		this.loginEmployee.storeCheckIn.push(checkIn);
		this.employeeService.update(this.clinicHelperService.loginEmployee).then(payload => {
			this.clinicHelperService.loginEmployee = payload;


			let keepCheckIn;
			this.clinicHelperService.loginEmployee.storeCheckIn.forEach((itemi, i) => {
				itemi.isOn = false;
				if (itemi._id === checkIn._id) {
					itemi.isOn = true;
					keepCheckIn = itemi;
				}
			});


			this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'store' });

			this.close_onClick();
		});
	}
	changeRoom(checkIn: any) {
		let keepCheckIn;
		this.clinicHelperService.loginEmployee.storeCheckIn.forEach((itemi, i) => {
			itemi.isOn = false;
			if (itemi._id === checkIn._id) {
				itemi.isOn = true;
				keepCheckIn = itemi;
			}
		});
		this.employeeService.update(this.clinicHelperService.loginEmployee).then(payload => {
			this.clinicHelperService.loginEmployee = payload;
			this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'store' });
			this.close_onClick();
		});
	}
}
