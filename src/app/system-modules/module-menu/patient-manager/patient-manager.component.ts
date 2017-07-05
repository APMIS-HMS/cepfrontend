import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FacilitiesService, EmployeeService } from '../../../services/facility-manager/setup/index';
import { Employee, Facility } from '../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { PatientmanagerHomepageComponent } from './patientmanager-homepage/patientmanager-homepage.component'

@Component({
  selector: 'app-patient-manager',
  templateUrl: './patient-manager.component.html',
  styleUrls: ['./patient-manager.component.scss']
})
export class PatientManagerComponent implements OnInit, AfterViewInit {
  @ViewChild(PatientmanagerHomepageComponent)
  private patientManagerComponent: PatientmanagerHomepageComponent;
  homeContentArea = true;
  employeeDetailArea = false;
  newEmp = false;
  patient: any;
  modal_on: boolean = false;
  loginEmployee: Employee = <Employee>{};
	selectedFacility: Facility = <Facility>{};

  searchControl = new FormControl();

  pageInView = 'Patient Manager';

  facilityObj = {
    'logo': 'assets/images/logos/red.jpg'
  };

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private _locker: CoolLocalStorage,
    public facilityService: FacilitiesService,
		private _employeeService: EmployeeService
  ) { }

  ngAfterViewInit() {
    this.searchControl.valueChanges.subscribe(searchText => {
      this.patientManagerComponent.searchPatients(searchText);
    });
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


    this.searchControl.valueChanges.subscribe(value => {
      // do something with value here
    });
    this.route.params.subscribe(params => {
      //console.log(params);
    })
  }

  navEpHome() {
    this.homeContentArea = true;
    this.employeeDetailArea = false;
  }
  newEmpShow() {
    this.newEmp = true;
  }
  close_onClick(e) {
    this.newEmp = false;
  }
  pageInViewLoader(title) {
    this.pageInView = title;
  }
  empDetailShow(val) {
    this.homeContentArea = false;
    this.employeeDetailArea = true;
    this.patient = val;
  }
  HomeContentArea_show() {
    this.homeContentArea = true;
    this.employeeDetailArea = false;
    this.pageInView = 'Patient Manager';
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

}
