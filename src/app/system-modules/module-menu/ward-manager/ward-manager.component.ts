import { Component, Input, Output, OnInit, AfterViewInit, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FacilitiesService, EmployeeService } from '../../../services/facility-manager/setup/index';
import { Employee, Facility } from '../../../models/index';
import { WardEmitterService } from '../../../services/facility-manager/ward-emitter.service';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
	selector: 'app-ward-manager',
	templateUrl: './ward-manager.component.html',
	styleUrls: ['./ward-manager.component.scss']
})
export class WardManagerComponent implements OnInit, OnDestroy {
	@Input() checkedInWard: any;
	pageInView: string;
	loginEmployee: Employee = <Employee>{};
	selectedFacility: Facility = <Facility>{};
	wardTitle: String = '';
	isWardAvailable: Boolean = false;
	modal_on: Boolean = false;
	admissionNavMenu = false;
	admittedNavMenu = false;
	wardNavMenu = false;
	setupNavMenu = false;
	transferNavMenu = false;
	contentSecMenuShow = false;
	checkedInObject: any = <any>{};

	searchControl = new FormControl();

	constructor(
		private _locker: CoolLocalStorage,
		private _wardEventEmitter: WardEmitterService,
		private _router: Router,
		private _employeeService: EmployeeService
	) {

	}

	ngOnInit() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.loginEmployee = <Employee>this._locker.getObject('loginEmployee');
		const page: string = this._router.url;
		this.checkPageUrl(page);
		this._wardEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});

		// Update the wardCheckedIn object when it changes.
		this._wardEventEmitter.announceWard.subscribe(val => {
			this.checkedInObject = val;
		});

		if ((this.loginEmployee.wardCheckIn === undefined
		  || this.loginEmployee.wardCheckIn.length === 0)) {
		  this.modal_on = true;
		} else {
		  let isOn = false;
		  this.loginEmployee.wardCheckIn.forEach((x, r) => {
			if (x.isDefault) {
			  x.isOn = true;
			  x.lastLogin = new Date();
			  isOn = true;
			  let checkingObject = { typeObject: x, type: 'ward' };
			  this.checkedInObject = checkingObject;
			  // this._employeeService.announceCheckIn(checkingObject);
			  // Set page title
			  this.isWardAvailable = true;
			  this.wardTitle = x.minorLocationId.name;
			  this._employeeService.update(this.loginEmployee).then(res => {
				this.loginEmployee = res;
				checkingObject = { typeObject: x, type: 'ward' };
				this.checkedInObject = checkingObject;
				this._wardEventEmitter.announceWardChange(checkingObject);
				this._employeeService.announceCheckIn(checkingObject);
				this._locker.setObject('wardCheckingObject', checkingObject);
			  });
			}
		  });

		  if (!isOn) {
			this.loginEmployee.wardCheckIn.forEach((x, r) => {
			  if (r === 0) {
				x.isOn = true;
				x.lastLogin = new Date();
				// Set page title
				this.isWardAvailable = true;
				this.wardTitle = x.minorLocationId.name;
				this._employeeService.update(this.loginEmployee).then(payload => {
				  this.loginEmployee = payload;
				  const checkingObject = { typeObject: x, type: 'ward' };
					this.checkedInObject = checkingObject;
					this._wardEventEmitter.announceWardChange(checkingObject);
				  this._employeeService.announceCheckIn(checkingObject);
				  this._locker.setObject('wardCheckingObject', checkingObject);
				});
			  }
			});
		  }
		}
	}

	checkIntoWard() {
		this.modal_on = true;
	}

	pageInViewLoader(title) {
		this.pageInView = title;
	}

	onClickNavMenu(link: string, menu: string) {
    this.admissionNavMenu = false;
		this.admittedNavMenu = false;
		this.setupNavMenu = false;
    this.wardNavMenu = false;

		this._router.navigate([link]);
		this._wardEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });

		switch (menu) {
			case 'admission':
			this.admissionNavMenu = true;
			break;
			case 'admitted':
			this.admittedNavMenu = true;
			break;
			case 'setup':
				this.setupNavMenu = true;
			break;
			case 'wards':
				this.wardNavMenu = true;
			break;
		}
	}

	private checkPageUrl(param: string) {
		if (param.includes('admission')) {
			this.admissionNavMenu = true;
		} else if (param.includes('admitted')) {
			this.admittedNavMenu = true;
		} else if (param.includes('setup')) {
			this.setupNavMenu = true;
		} else if (param.includes('wards')) {
			this.wardNavMenu = true;
		}
	}

	// getCheckedInWard(value: any) {
	// 	const checkedInObject = { typeObject: value, type: 'ward' };
	// 	this.checkedInObject = checkedInObject;
	// }

	close_onClick(message: boolean): void {
		this.modal_on = false;
	}

	ngOnDestroy() {
		this._employeeService.announceCheckIn(undefined);
		this._locker.setObject('wardCheckingObject', {});
		this.checkedInObject = {};
	}
}
