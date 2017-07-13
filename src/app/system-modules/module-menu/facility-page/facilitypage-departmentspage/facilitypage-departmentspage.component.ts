import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilitiesService, DepartmentService } from '../../../../services/facility-manager/setup/index';
import { Facility, Department, MinorLocation, Location } from '../../../../models/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-facilitypage-departmentspage',
  templateUrl: './facilitypage-departmentspage.component.html',
  styleUrls: ['./facilitypage-departmentspage.component.scss']
})
export class FacilitypageDepartmentspageComponent implements OnInit {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('unititem') unititem;
  modal_on = false;
  newDeptModal_on = false;
  newUnitModal_on = false;

  innerMenuShow = false;
  departmentService: DepartmentService;
  deptsObj: Department[] = [];
  deptObj: Department = <Department>{};

  // Department icons nav switches
  deptHomeContentArea = true;
  deptDetailContentArea = false;
  deptEditContentArea = false;

  // Department list fields edit icon states
  deptEditNameIcoShow = false;
  deptEditShortNameIcoShow = false;
  deptEditDescIcoShow = false;

  unitEditNameIcoShow = false;
  unitEditShortNameIcoShow = false;
  unitEditDescIcoShow = false;

  deptNameEdit = new FormControl();
  deptshortNameEdit = new FormControl();
  deptDescEdit = new FormControl();

  unitNameEdit = new FormControl();
  unitshortNameEdit = new FormControl();
  unitDescEdit = new FormControl();
  facilityObj: Facility = <Facility>{};

  locations: Location[] = [];
  selectedLocation: Location = <Location>{};
  minorLocations: MinorLocation[] = [];
  constructor(public facilityService: FacilitiesService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private locker: CoolSessionStorage) {
    this.facilityService.listner.subscribe(payload => {
      console.log(payload);
      this.facilityObj = payload;
      this.getCurrentDepartment();
      this.deptsObj = payload.departments;
    });

  }
  getCurrentDepartment() {
    let deptObj = this.deptObj;

    this.facilityObj.departments.forEach((item, i) => {
      if (item._id === deptObj._id) {
        deptObj = item;
      }
    });
    this.deptObj = deptObj;
  }
  updateFacility() {
    this.facilityService.update(this.facilityObj).then(payload => {
      this.facilityObj = payload;
      this.getCurrentDepartment();
    });
  }
  getLocations() {
    this.locationService.findAll().then(payload => {
      this.locations = payload.data;
      this.locations.forEach(item => {
        if (item.name === 'Clinic') {
          this.selectedLocation = item;
          const facility: Facility =  <Facility> this.locker.getObject('selectedFacility');
          console.log(facility.minorLocations);
          facility.minorLocations.forEach((itemi: MinorLocation) => {
            if (itemi.locationId === this.selectedLocation._id) {
              this.minorLocations.push(itemi);
              console.log(this.minorLocations);
            }
          });

        }
      });
    });
  }
  updateDepartmentProperties(prop: any, value: any) {
    const id = this.deptObj._id;
    this.facilityObj.departments.forEach((item, i) => {
      if (item._id === id) {
        item[prop] = value;
        this.updateFacility();
      }
    });
  }
  updateUnitProperties(prop: any, value: any) {
    const units = this.deptObj.units;
    units.forEach((item, i) => {
    });
  }
  ngOnInit() {

    this.pageInView.emit('Departments');

    this.deptNameEdit.valueChanges.subscribe(value => {
      this.updateDepartmentProperties('name', value);
    });
    this.deptshortNameEdit.valueChanges.subscribe(value => {
      this.updateDepartmentProperties('shortName', value);
    });
    this.deptDescEdit.valueChanges.subscribe(value => {
      this.updateDepartmentProperties('description', value);
    });

    this.unitNameEdit.valueChanges.subscribe(value => {
      this.updateUnitProperties('name', 'Hardwares');
    });
    this.unitshortNameEdit.valueChanges.subscribe(value => {

    });
    this.unitDescEdit.valueChanges.subscribe(value => {
      // do something with value here
    });

    this.route.data.subscribe(data => {
      data['facility'].subscribe((payload: any) => {
         this.facilityObj = payload;
      this.deptsObj = this.facilityObj.departments;
      });
    });

    // this.getFacility();
    // this.facilityObj = this.facilityService.getSelectedFacilityId();
    // this.deptsObj = this.facilityObj.departments;
  }
  getFacility() {
    const facility =  <Facility> this.locker.getObject('selectedFacility');
    this.facilityService.get(facility._id, {}).then((payload) => {
      this.facilityObj = payload;
      this.deptsObj = this.facilityObj.departments;
    },
      error => {
        console.log(error);
      })
  }

  deptDetalContentArea_show(model: any) {
    this.deptHomeContentArea = false;
    this.deptDetailContentArea = true;
    this.deptEditContentArea = false;
    this.innerMenuShow = false;
    this.deptObj = model;
  }

  deptHomeContentArea_show() {
    this.deptHomeContentArea = true;
    this.deptDetailContentArea = false;
    this.deptEditContentArea = false;
    this.innerMenuShow = false;
  }

  deptDetalContentArea_remove(model: Department) {
    this.departmentService.remove(model._id, model);
  }
  deptEditNameToggle() {
    this.deptEditNameIcoShow = !this.deptEditNameIcoShow;
  }
  deptEditShortNameToggle() {
    this.deptEditShortNameIcoShow = !this.deptEditShortNameIcoShow;
  }
  deptEditDescToggle() {
    this.deptEditDescIcoShow = !this.deptEditDescIcoShow;
  }

  unitEditNameToggle() {
    this.unitEditNameIcoShow = !this.unitEditNameIcoShow;
  }
  unitEditShortNameToggle() {
    this.unitEditShortNameIcoShow = !this.unitEditShortNameIcoShow;
  }
  unitEditDescToggle() {
    this.unitEditDescIcoShow = !this.unitEditDescIcoShow;
  }

  newDeptModal_show() {
    this.modal_on = false;
    this.newDeptModal_on = true;
    this.innerMenuShow = false;
  }
  newUnitModal_show() {
    this.modal_on = false;
    this.newUnitModal_on = true;
    this.innerMenuShow = false;
  }
  close_onClick(message: boolean): void {
    this.modal_on = false;
    this.newUnitModal_on = false;
    this.newDeptModal_on = false;
  }
  editUnit(){
    this.modal_on = false;
    this.newUnitModal_on = true;
    this.newDeptModal_on = false;
  }
  innerMenuToggle() {
    this.innerMenuShow = !this.innerMenuShow;
  }
  innerMenuHide(e) {
    if (e.srcElement.id !== 'submenu_ico') {
      this.innerMenuShow = false;
    }
  }

}
