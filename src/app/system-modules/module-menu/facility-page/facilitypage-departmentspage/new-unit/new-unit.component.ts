import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService } from '../../../../../services/facility-manager/setup/index';
import { Facility, Department } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-new-unit',
  templateUrl: './new-unit.component.html',
  styleUrls: ['./new-unit.component.scss']
})
export class NewUnitComponent implements OnInit {
  @Input() department: Department;
  deptsObj: Department[] = [];
  mainErr = true;
  errMsg = 'you have unresolved errors';
  mainErrClinic = true;
  errMsgClinic = 'you have unresolved errors';

  isClinic = false;

  facilityObj: Facility = <Facility>{};

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  public frmNewUnit: FormGroup;
  clinicForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    public facilityService: FacilitiesService) { }

  ngOnInit() {
    this.addNew();
    this.addNew2();
    this.frmNewUnit.controls['unitParent'].valueChanges.subscribe(payload => {

    });
    // this.getFacility();
    this.facilityObj = <Facility> this.facilityService.getSelectedFacilityId();
    this.deptsObj = this.facilityObj.departments;
    this.frmNewUnit.controls['unitParent'].setValue(this.department._id);
  }
  addNew() {
    this.frmNewUnit = this.formBuilder.group({
      unitName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      unitAlias: ['', [<any>Validators.minLength(2)]],
      unitParent: ['', [<any>Validators.required]],
      isClinic: ['', []],
      unitDesc: ['', [<any>Validators.required, <any>Validators.minLength(10)]]
    });
  }

  addNew2() {
    this.clinicForm = this.formBuilder.group({
      'clinicArray': this.formBuilder.array([
        this.formBuilder.group({
          clinicLocation: ['', [<any>Validators.required]],
          clinicName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
          'readonly': [false],
        })
      ])
    });
  }
  onAddHobby(children: any, valid: boolean) {
    if (valid) {
      if (children.clinicName === '' || children.clinicName === ' ') {
        this.mainErrClinic = false;
        this.errMsgClinic = 'you left out a required field';
      } else {
        console.log(children);
        if (children != null) {
          children.value.readonly = true;
          (<FormArray>this.clinicForm.controls['clinicArray'])
            .push(
            this.formBuilder.group({
              clinicName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
              'readonly': [false],
            })
            );
            this.mainErrClinic = true;
            this.errMsgClinic = '';
        } else {
          const innerChildren: any = children.value;
        }
      }
    } else {
      this.mainErrClinic = false;
      this.errMsgClinic = 'you left out a required field';
    }
  }
  newUnit(valid, val) {
    if (valid) {
      if (val.unitName === '' || val.unitName === ' ' || val.unitAlias === ''
        || val.unitAlias === ' ' || val.unitDesc === '' || val.unitDesc === ' ') {
        this.mainErr = false;
        this.errMsg = 'you left out a required field';
      } else {
        const id = this.department._id;
        const clinics = (<FormArray>this.clinicForm.controls['clinicArray']).controls.filter((x: any) => x.value.readonly);
        console.log(clinics);
        const clinicList = [];
        clinics.forEach((itemi, i) => {
          clinicList.push(itemi.value);
        });
        this.facilityObj.departments.forEach(function (item, i) {
          if (item._id === id) {
            item.units.push({
              name: val.unitName,
              shortName: val.unitAlias,
              description: val.unitDesc,
              clinics: clinicList
            });
          }
        });
        this.facilityService.update(this.facilityObj).then((payload) => {
          this.facilityObj = payload;
          this.addNew();
        })

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
