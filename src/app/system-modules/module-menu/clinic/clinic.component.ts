import { Component, OnInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService, ProfessionService, AppointmentService } from '../../../services/facility-manager/setup/index';
import { LocationService } from '../../../services/module-manager/setup/index';
import { Profession, Employee, Facility, Location, MinorLocation } from '../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ClinicHelperService } from './services/clinic-helper.service';
import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.scss']
})
export class ClinicComponent implements OnInit, OnDestroy {

  pageInView = 'Clinic Manager';
  contentSecMenuShow = false;
  modal_on = false;


  clinicLocations: MinorLocation[] = [];
  professions: Profession[] = [];
  loginEmployee: Employee = <Employee>{};
  selectedProfession: Profession = <Profession>{};
  clinic: Location = <Location>{};
  selectedFacility: Facility = <Facility>{};

  isDoctor = false;
  counter = 0;

  constructor(private router: Router, private appointmentService: AppointmentService,
    private professionService: ProfessionService,
    private locker: CoolLocalStorage,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    public clinicHelperService: ClinicHelperService,
    private locationService: LocationService) {

    // this.route.data.subscribe(data => {
    //   data['loginEmployee'].subscribe(payload => {
    //     this.loginEmployee = payload.loginEmployee;
    //   });
    // });

  }


  ngOnInit() {
    console.log(1)
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    const auth: any = this.locker.getObject('auth');
    console.log(this.selectedFacility._id);
    console.log(auth);
    const emp$ = Observable.fromPromise(this.employeeService.find({
      query: {
        facilityId: this.selectedFacility._id, personId: auth.data.personId, showbasicinfo: true
      }
    }));
		emp$.mergeMap((emp: any) => {
			if (emp.data.length > 0) {
				return Observable.forkJoin([Observable.fromPromise(this.employeeService.get(emp.data[0]._id, {})),
				]);
			} else {
				return Observable.of(undefined);
			}
		})
			.subscribe((results: any) => {
				this.loginEmployee = results[0];
				console.log(this.loginEmployee);
				this.clinicHelperService.getClinicMajorLocation();

				console.log(this.loginEmployee);
				if (this.loginEmployee.professionObject !== undefined) {
					if (this.loginEmployee.professionObject.name === 'Doctor'
						&& (this.loginEmployee.consultingRoomCheckIn === undefined
							|| this.loginEmployee.consultingRoomCheckIn.length === 0)) {
						console.log(2)
						this.modal_on = true;
					} else if (this.loginEmployee.professionObject.name === 'Doctor') {
						console.log(3)
						let isOn = false;
						this.isDoctor = true;
						this.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
							if (itemr.isDefault === true) {
								itemr.isOn = true;
								itemr.lastLogin = new Date();
								isOn = true;
								if (this.counter === 0) {
									this.employeeService.update(this.loginEmployee).then(payload => {
										this.loginEmployee = payload;
										this.employeeService.announceCheckIn({ typeObject: itemr, type: 'clinic' });
									});
								}
							}
						});
						if (isOn === false) {
							console.log(4)
							this.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
								if (r === 0) {
									itemr.isOn = true;
									itemr.lastLogin = new Date();
									if (this.counter === 0) {
										this.employeeService.update(this.loginEmployee).then(payload => {
											this.loginEmployee = payload;
											this.employeeService.announceCheckIn({ typeObject: itemr, type: 'clinic' });
										});
									}
								}

							});
						}
						this.counter++;
					} else {
						this.isDoctor = false;
					}
				}
			});

	}

	changeRoom() {
		this.modal_on = true;
	}
	pageInViewLoader(title) {
		this.pageInView = title;
	}
	navItemClick() {
		this.contentSecMenuShow = false;
	}
	contentSecMenuToggle() {
		this.contentSecMenuShow = !this.contentSecMenuShow;
	}
	innerMenuHide(e) {
		if (
			e.srcElement.className === 'inner-menu1-wrap' ||
			e.srcElement.localName === 'i' ||
			e.srcElement.id === 'innerMenu-ul'
		) { } else {
			this.contentSecMenuShow = false;
		}
	}
	closeActivate(e) {
		if (e.srcElement.id !== 'contentSecMenuToggle') {
			this.contentSecMenuShow = false;
		}
		this.appointmentService.hideTimelineAnnounced(true);
	}
	close_onClick(message: boolean): void {
		this.modal_on = false;
	}
	ngOnDestroy() {
		if (this.clinicHelperService.loginEmployee.consultingRoomCheckIn !== undefined) {
			this.clinicHelperService.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
				if (itemr.isDefault === true && itemr.isOn === true) {
					itemr.isOn = false;
					this.employeeService.update(this.clinicHelperService.loginEmployee).then(payload => {
						this.clinicHelperService.loginEmployee = payload;
					});
				}
			});
		}
		this.employeeService.announceCheckIn(undefined);
	}
}
