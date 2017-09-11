import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService } from '../../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

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

  public frmNewDept: FormGroup;

  constructor(private formBuilder: FormBuilder, public facilityService: FacilitiesService,
    private locker: CoolLocalStorage) {
    this.facilityService.listner.subscribe(payload => {
      this.facilityObj = payload;
    })
  }

  ngOnInit() {
    this.addNew();
    // this.getFacility();
    this.facilityObj = this.facilityService.getSelectedFacilityId();
  }
  addNew() {
    this.frmNewDept = this.formBuilder.group({
      deptName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      deptAlias: ['', [<any>Validators.minLength(2)]],
      deptDesc: ['', [<any>Validators.required, <any>Validators.minLength(10)]]
    });
  }
  // getFacility() {
  //   let tokenObj: any = this.locker.getObject('auth');
  //   this.facilityService.get(tokenObj.data.facilitiesRole[0].facilityId, {}).then((payload) => {
  //     this.facilityObj = payload;
  //   },
  //     error => {
  //       console.log(error);
  //     })
  // }
  newDept(valid, val) {
    if (valid) {
      if (val.deptName === '' || val.deptName === ' ' || val.deptAlias === '' ||
        val.deptAlias === ' ' || val.deptDesc === '' || val.deptDesc === ' ') {
        this.mainErr = false;
        this.errMsg = 'you left out a required field';
      } else {
        let department: any = { name: val.deptName };
        this.facilityObj.departments.push(department);
        this.facilityService.update(this.facilityObj).then((payload) => {
          this.locker.setObject('selectedFacility', payload);
          this.addNew();

          this.close_onClick();
        });
        this.mainErr = true;
      }
    } else {
      this.mainErr = false;
    }
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
