import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PharmacyEmitterService } from '../../../services/facility-manager/pharmacy-emitter.service';
import { FacilitiesService, EmployeeService } from '../../../services/facility-manager/setup/index';
import { Employee, Facility } from '../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-pharmacy-manager',
	templateUrl: './pharmacy-manager.component.html',
	styleUrls: ['./pharmacy-manager.component.scss']
})

export class PharmacyManagerComponent implements OnInit {
	pageInView: String = '';
	modal_on: boolean = false;
	// pharmacyNavMenu = false;
	// categoryNavMenu = false;
	supplierNavMenu = false;
	// manufacturerNavMenu = false;
	// routeNavMenu = false;
	// genericNavMenu = false;
	// presentationNavMenu = false;
	// strengthNavMenu = false;
	// contentSecMenuShow = false;

	// pharmacys page
	// addPharmacy = false;
	// pharmacyCat = false;
	// generic = false;
	// pharmacyRoute = false;
	// manufacturer = false;
	// presentation = false;
	// strength = false;
	// productCat = false;
	productNavMenu = false;
	// productRoute = false;
	loginEmployee: Employee = <Employee>{};
	selectedFacility: Facility = <Facility>{};

	constructor(
		private _router: Router,
		private _locker: CoolLocalStorage,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		public facilityService: FacilitiesService,
		private _employeeService: EmployeeService
	) {
		// this.facilityService.sliderAnnounced$.subscribe(value => {
		// 	if (value === false) {
		// 		this.addPharmacy = false;
		// 		this.pharmacyCat = false;
		// 		this.generic = false;
		// 		this.pharmacyRoute = false;
		// 		this.manufacturer = false;
		// 		this.presentation = false;
		// 	}

		// })
	}

	ngOnInit() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		const auth: any = this._locker.getObject('auth');
		const emp$ = Observable.fromPromise(this._employeeService.find({
			query: {
				facilityId: this.selectedFacility._id,
				personId: auth.data.personId,
				showbasicinfo: true
			}
		}));
		emp$.mergeMap((emp: any) => Observable.forkJoin([Observable.fromPromise(this._employeeService.get(emp.data[0]._id, {})),
		]))
			.subscribe((results: any) => {
				this.loginEmployee = results[0];
				console.log(results);
				if ((this.loginEmployee.storeCheckIn === undefined
					|| this.loginEmployee.storeCheckIn.length === 0)) {
					this.modal_on = true;
				} else {
					let isOn = false;
					this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
						if (itemr.isDefault === true) {
							itemr.isOn = true;
							itemr.lastLogin = new Date();
							isOn = true;
							let checkingObject = { typeObject: itemr, type: 'store' };
							this._employeeService.announceCheckIn(checkingObject);
							console.log('sent');
							this._employeeService.update(this.loginEmployee).then(payload => {
								this.loginEmployee = payload;
								checkingObject = { typeObject: itemr, type: 'store' };
								this._employeeService.announceCheckIn(checkingObject);
								this._locker.setObject('checkingObject', checkingObject);
							});
						}
					});
					if (isOn === false) {
						this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
							if (r === 0) {
								itemr.isOn = true;
								itemr.lastLogin = new Date();
								this._employeeService.update(this.loginEmployee).then(payload => {
									this.loginEmployee = payload;
									const checkingObject = { typeObject: itemr, type: 'store' };
									this._employeeService.announceCheckIn(checkingObject);
									this._locker.setObject('checkingObject', checkingObject);
								});
							}
						});
					}
				}
			});

		let page: string = this._router.url;
		//this.checkPageUrl(page);
		this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});

	}

	close_onClick(message: boolean): void {
		this.modal_on = false;
	}

	ngOnDestroy() {
		if (this.loginEmployee.consultingRoomCheckIn !== undefined) {
			this.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
				if (itemr.isDefault === true && itemr.isOn === true) {
					itemr.isOn = false;
					this._employeeService.update(this.loginEmployee).then(payload => {
						this.loginEmployee = payload;
					});
				}
			});
		}
		this._employeeService.announceCheckIn(undefined);
		this._locker.setObject('checkingObject', {});
	}

	// contentSecMenuToggle() {
	// 	this.contentSecMenuShow = !this.contentSecMenuShow;
	// }

	// closeActivate(e) {
	// 	if (e.srcElement.id !== 'contentSecMenuToggle') {
	// 		this.contentSecMenuShow = false;
	// 	}
	// }

	// onClickPharmacyNavMenu() {
	// 	this.facilityService.announceSlider(false);
	// 	this.pharmacyNavMenu = true;
	// 	this.categoryNavMenu = false;
	// 	this.supplierNavMenu = false;
	// 	this.manufacturerNavMenu = false;
	// 	this.routeNavMenu = false;
	// 	this.genericNavMenu = false;
	// 	this.presentationNavMenu = false;
	// 	this.strengthNavMenu = false;
	// 	this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
	// 		this.pageInView = url;
	// 	});
	// }

	// onClickCategoryNavMenu() {
	// 	this.pharmacyNavMenu = false;
	// 	this.categoryNavMenu = true;
	// 	this.supplierNavMenu = false;
	// 	this.manufacturerNavMenu = false;
	// 	this.routeNavMenu = false;
	// 	this.genericNavMenu = false;
	// 	this.presentationNavMenu = false;
	// 	this.strengthNavMenu = false;
	// 	this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
	// 		this.pageInView = url;
	// 	});
	// }

	// onClickSupplierNavMenu() {
	// 	// this.facilityService.announceSlider(false);
	// 	this.categoryNavMenu = false;
	// 	this.supplierNavMenu = true;
	// 	this.manufacturerNavMenu = false;
	// 	this.routeNavMenu = false;
	// 	this.genericNavMenu = false;
	// 	this.presentationNavMenu = false;
	// 	this.strengthNavMenu = false;
	// 	this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
	// 		this.pageInView = url;
	// 	});
	// }

	// onClickManufacturerNavMenu() {
	// 	this.pharmacyNavMenu = false;
	// 	this.categoryNavMenu = false;
	// 	this.supplierNavMenu = false;
	// 	this.manufacturerNavMenu = true;
	// 	this.routeNavMenu = false;
	// 	this.genericNavMenu = false;
	// 	this.presentationNavMenu = false;
	// 	this.strengthNavMenu = false;
	// 	this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
	// 		this.pageInView = url;
	// 	});
	// }

	// onClickRouteNavMenu() {
	// 	this.pharmacyNavMenu = false;
	// 	this.categoryNavMenu = false;
	// 	this.supplierNavMenu = false;
	// 	this.manufacturerNavMenu = false;
	// 	this.routeNavMenu = true;
	// 	this.genericNavMenu = false;
	// 	this.presentationNavMenu = false;
	// 	this.strengthNavMenu = false;
	// 	this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
	// 		this.pageInView = url;
	// 	});
	// }

	// onClickGenericNavMenu() {
	// 	this.pharmacyNavMenu = false;
	// 	this.categoryNavMenu = false;
	// 	this.supplierNavMenu = false;
	// 	this.manufacturerNavMenu = false;
	// 	this.routeNavMenu = false;
	// 	this.genericNavMenu = true;
	// 	this.presentationNavMenu = false;
	// 	this.strengthNavMenu = false;
	// 	this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
	// 		this.pageInView = url;
	// 	});
	// }

	// onClickPresentationNavMenu() {
	// 	this.pharmacyNavMenu = false;
	// 	this.categoryNavMenu = false;
	// 	this.supplierNavMenu = false;
	// 	this.manufacturerNavMenu = false;
	// 	this.routeNavMenu = false;
	// 	this.genericNavMenu = false;
	// 	this.presentationNavMenu = true;
	// 	this.strengthNavMenu = false;
	// 	this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
	// 		this.pageInView = url;
	// 	});
	// }

	// onClickStrengthNavMenu() {
	// 	this.pharmacyNavMenu = false;
	// 	this.categoryNavMenu = false;
	// 	this.supplierNavMenu = false;
	// 	this.manufacturerNavMenu = false;
	// 	this.routeNavMenu = false;
	// 	this.genericNavMenu = false;
	// 	this.presentationNavMenu = false;
	// 	this.strengthNavMenu = true;
	// 	this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
	// 		this.pageInView = url;
	// 	});
	// }

	pageInViewLoader(title) {
		this.pageInView = title;
	}

	// private checkPageUrl(param: string) {
	// 	if (param.includes('pharmacys')) {
	// 		this.pharmacyNavMenu = true;
	// 	} else if (param.includes('categories')) {
	// 		this.categoryNavMenu = true;
	// 	} else if (param.includes('suppliers')) {
	// 		this.supplierNavMenu = true;
	// 	} else if (param.includes('manufacturers')) {
	// 		this.manufacturerNavMenu = true;
	// 	} else if (param.includes('routes')) {
	// 		this.routeNavMenu = true;
	// 	} else if (param.includes('generics')) {
	// 		this.genericNavMenu = true;
	// 	} else if (param.includes('presentations')) {
	// 		this.presentationNavMenu = true;
	// 	}
	// }
	// pharmacyCatSlide() {
	// 	this.addPharmacy = false;
	// 	this.pharmacyCat = true;
	// 	this.generic = false;
	// 	this.pharmacyRoute = false;
	// 	this.manufacturer = false;
	// 	this.presentation = false;
	// 	this.strength = false;
	// }
	// genericSlide() {
	// 	this.addPharmacy = false;
	// 	this.pharmacyCat = false;
	// 	this.generic = true;
	// 	this.pharmacyRoute = false;
	// 	this.manufacturer = false;
	// 	this.presentation = false;
	// 	this.strength = false;
	// }
	// presentationSlide() {
	// 	this.addPharmacy = false;
	// 	this.pharmacyCat = false;
	// 	this.generic = false;
	// 	this.pharmacyRoute = false;
	// 	this.manufacturer = false;
	// 	this.presentation = true;
	// 	this.strength = false;
	// }
	// routeSlide() {
	// 	this.addPharmacy = false;
	// 	this.pharmacyCat = false;
	// 	this.generic = false;
	// 	this.pharmacyRoute = true;
	// 	this.manufacturer = false;
	// 	this.presentation = false;
	// 	this.strength = false;
	// }
	// manufacturerSlide() {
	// 	this.addPharmacy = false;
	// 	this.pharmacyCat = false;
	// 	this.generic = false;
	// 	this.pharmacyRoute = false;
	// 	this.manufacturer = true;
	// 	this.presentation = false;
	// 	this.strength = false;
	// }

	// strengthSlide() {
	// 	this.addPharmacy = false;
	// 	this.pharmacyCat = false;
	// 	this.generic = false;
	// 	this.pharmacyRoute = false;
	// 	this.manufacturer = false;
	// 	this.presentation = false;
	// 	this.strength = true;
	// }

}
