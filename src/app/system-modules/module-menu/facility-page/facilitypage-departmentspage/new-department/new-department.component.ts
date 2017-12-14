import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService } from '../../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-new-department',
  templateUrl: './new-department.component.html',
  styleUrls: ['./new-department.component.scss']
})
export class NewDepartmentComponent implements OnInit {
  facilityObj: Facility = <Facility>{};
  mainErr = true;
  errMsg = 'you have unresolved errors';

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  newDeptModal_on = false;
  newUnitModal_on = false;
  modal_on = false;
  isBusy = false;

  public frmNewDept: FormGroup;

  constructor(private formBuilder: FormBuilder, public facilityService: FacilitiesService,
    private locker: CoolLocalStorage, private systemService:SystemModuleService) {
    this.facilityService.listner.subscribe(payload => {
      this.facilityObj = payload;
    })
  }

  ngOnInit() {
    this.addNew();
    this.facilityObj = this.facilityService.getSelectedFacilityId();
  }
  addNew() {
    this.frmNewDept = this.formBuilder.group({
      deptName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      deptAlias: ['', [<any>Validators.minLength(2)]],
      deptDesc: ['', [<any>Validators.minLength(10)]]
    });
  }

  newDept(valid, val) {
    if (valid) {
      this.isBusy = true;
      this.systemService.on();
      if (val.deptName === '' || val.deptName === ' ') {
        this.mainErr = false;
        this.errMsg = 'you left out a required field';
        this.isBusy = false;
      } else {
        let department: any = { name: val.deptName };
        this.facilityObj.departments.push(department);
        this.facilityService.update(this.facilityObj).then((payload) => {
          this.locker.setObject('selectedFacility', payload);
          this.addNew();
          this.isBusy = false;
          this.systemService.off();
          this.close_onClick();
        }).catch(err =>{
          this.isBusy = false;
          this.systemService.off();
        });
        this.mainErr = true;
      }
    } else {
      this.mainErr = false;
      this.isBusy = false;
      this.systemService.off();
    }
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
