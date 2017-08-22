import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FacilitiesService, EmployeeService } from '../../../services/facility-manager/setup/index';
import { Employee, Facility } from '../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.scss']
})
export class LabComponent implements OnInit {
  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  pageInView = 'Laboratory';
  loginEmployee: Employee = <Employee>{};
  selectedFacility: Facility = <Facility>{};
  workbenchTitle: string = '';
  isWorkbenchAvailable: boolean = false;
  modal_on: boolean = false;
  contentSecMenuShow = false;
  requestContentArea = false;
  workbenchContentArea = false;
  investigationContentArea = false;
  pricingContentArea = false;
  panelContentArea = false;
  reportContentArea = false;

  constructor(
    private _router: Router,
    private _locker: CoolSessionStorage,
    public facilityService: FacilitiesService,
		private _employeeService: EmployeeService
  ) { }

  ngOnInit() {
    const page: string = this._router.url;
    this.checkPageUrl(page);
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.loginEmployee = <Employee>this._locker.getObject('loginEmployee');
    this.modal_on = true;
    
    //console.log(this.loginEmployee);
    // if ((this.loginEmployee.storeCheckIn === undefined
    //   || this.loginEmployee.storeCheckIn.length === 0)) {
    //   this.modal_on = true;
    // } else {
    //   let isOn = false;
    //   this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
    //     if (itemr.isDefault === true) {
    //       itemr.isOn = true;
    //       itemr.lastLogin = new Date();
    //       isOn = true;
    //       let checkingObject = { typeObject: itemr, type: 'store' };
    //       this._employeeService.announceCheckIn(checkingObject);
    //       // Set page title
    //       this.isWorkbenchAvailable = true;
    //       this.workbenchTitle = itemr.storeObject.name;
    //       this._employeeService.update(this.loginEmployee).then(payload => {
    //         this.loginEmployee = payload;
    //         checkingObject = { typeObject: itemr, type: 'store' };
    //         this._employeeService.announceCheckIn(checkingObject);
    //         this._locker.setObject('checkingObject', checkingObject);
    //       });
    //     }
    //   });
    //   if (isOn === false) {
    //     this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
    //       if (r === 0) {
    //         itemr.isOn = true;
    //         itemr.lastLogin = new Date();
    //         // Set page title
    //         this.isWorkbenchAvailable = true;
    //         this.workbenchTitle = itemr.storeObject.name;
    //         this._employeeService.update(this.loginEmployee).then(payload => {
    //           this.loginEmployee = payload;
    //           const checkingObject = { typeObject: itemr, type: 'store' };
    //           this._employeeService.announceCheckIn(checkingObject);
    //           this._locker.setObject('checkingObject', checkingObject);
    //         });
    //       }
    //     });
    //   }
    // }

  }
  
	contentSecMenuToggle() {
		this.contentSecMenuShow = !this.contentSecMenuShow;
  }
  
  checkPageUrl(param: string) {
		if (param.includes('request')) {
			this.requestContentArea = true;
      this.workbenchContentArea = false;
      this.investigationContentArea = false;
      this.pricingContentArea = false;
      this.panelContentArea = false;
      this.reportContentArea = false;
		} else if (param.includes('workbench')) {
			this.requestContentArea = false;
      this.workbenchContentArea = true;
      this.investigationContentArea = false;
      this.pricingContentArea = false;
      this.panelContentArea = false;
      this.reportContentArea = false;
		} else if (param.includes('investigation-pricing')) {
			this.requestContentArea = false;
      this.workbenchContentArea = false;
      this.investigationContentArea = false;
      this.pricingContentArea = true;
      this.panelContentArea = false;
      this.reportContentArea = false;
		} else if (param.includes('investigation')) {
			this.requestContentArea = false;
      this.workbenchContentArea = false;
      this.investigationContentArea = true;
      this.pricingContentArea = false;
      this.panelContentArea = false;
      this.reportContentArea = false;
		} else if(param.includes('panel')) {
      this.requestContentArea = false;
      this.workbenchContentArea = false;
      this.investigationContentArea = false;
      this.pricingContentArea = false;
      this.panelContentArea = true;
      this.reportContentArea = false;
    } else if(param.includes('report')) {
      this.requestContentArea = false;
      this.workbenchContentArea = false;
      this.investigationContentArea = false;
      this.pricingContentArea = false;
      this.panelContentArea = false;
      this.reportContentArea = true;
    }
  }
  
  checkIntoWorkbench() {
    this.modal_on = true;
  }

  close_onClick(message: boolean): void {
		this.modal_on = false;
	}
}
