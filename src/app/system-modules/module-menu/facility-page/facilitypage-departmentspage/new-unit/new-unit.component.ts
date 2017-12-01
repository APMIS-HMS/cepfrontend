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
  @Input() unit: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  deptsObj: Department[] = [];
  mainErr = true;
  errMsg = 'you have unresolved errors';
  mainErrClinic = true;
  errMsgClinic = 'you have unresolved errors';

  isClinic = false;
  btnText = 'CREATE UNIT';

  facilityObj: Facility = <Facility>{};
  public frmNewUnit: FormGroup;
  clinicForm: FormGroup;
  clinicsToDelele: any[] = [];
  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    public facilityService: FacilitiesService) { }

  ngOnInit() {
    this.addNew();
    this.addNew2();
    this.frmNewUnit.controls['unitParent'].valueChanges.subscribe(payload => {
      this.frmNewUnit.controls['isClinic'].valueChanges.subscribe(value => {
        this.isClinic = value;
<<<<<<< HEAD
        if ((<FormArray>this.clinicForm.controls['clinicArray']).controls.length === 0) {
=======
        if ((<FormArray>this.clinicForm.controls['clinicArray']).controls.length === 0 && this.unit._id !== undefined) {
>>>>>>> development
          this.addNew2();
        }
      })
    });
<<<<<<< HEAD
    // this.getFacility();
    this.facilityObj = <Facility> this.facilityService.getSelectedFacilityId();
=======
    this.facilityObj = <Facility>this.facilityService.getSelectedFacilityId();
>>>>>>> development
    this.deptsObj = this.facilityObj.departments;
    this.frmNewUnit.controls['unitParent'].setValue(this.department._id);



    (<FormGroup>(<FormArray>this.clinicForm.controls['clinicArray']).controls[0]).controls['clinicName'].valueChanges
      .subscribe(value => {
        this.mainErrClinic = true;
        this.errMsgClinic = '';
      });
<<<<<<< HEAD
=======
    if (this.unit !== undefined && this.unit._id !== undefined) {
      this.btnText = 'UPDATE UNIT';
      this.frmNewUnit.controls['unitName'].setValue(this.unit.name);
      this.frmNewUnit.controls['unitAlias'].setValue(this.unit.shortName);
      this.frmNewUnit.controls['unitDesc'].setValue(this.unit.description);
      this.frmNewUnit.controls['_id'].setValue(this.unit._id);
      if (this.unit.clinics.length > 0) {
        this.frmNewUnit.controls['isClinic'].setValue(true);
        this.clinicForm.controls['clinicArray'] = new FormArray([]);
        this.unit.clinics.forEach(clinic => {
          (<FormArray>this.clinicForm.controls['clinicArray']).push(
            this.formBuilder.group({
              clinicName: [clinic.clinicName, [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
              _id: [clinic._id, []],
              clinicCapacity: [clinic.clinicCapacity, []],
              'readonly': [true]
            })
          );
        })
      }
    } else {
      this.btnText = 'CREATE UNIT';
    }
    this.clinicsToDelele = [];
>>>>>>> development
  }
  addNew() {
    this.frmNewUnit = this.formBuilder.group({
      unitName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      unitAlias: ['', [<any>Validators.minLength(2)]],
      unitParent: ['', [<any>Validators.required]],
<<<<<<< HEAD
=======
      _id: [, []],
>>>>>>> development
      isClinic: [false, []],
      unitDesc: ['', [<any>Validators.required, <any>Validators.minLength(10)]]
    });


  }

  addNew2() {
    this.clinicForm = this.formBuilder.group({
      'clinicArray': this.formBuilder.array([
        this.formBuilder.group({
<<<<<<< HEAD
          clinicLocation: ['', [<any>Validators.required]],
=======
>>>>>>> development
          clinicName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
          clinicCapacity: [0, []],
          'readonly': [false],
        })
      ])
    });
  }
  onRemoveBill(clinic, i) {
    console.log(clinic);
<<<<<<< HEAD
=======
    this.clinicsToDelele.push(clinic.value);
>>>>>>> development
    console.log(i);
    (<FormArray>this.clinicForm.controls['clinicArray']).controls.splice(i, 1);
    if ((<FormArray>this.clinicForm.controls['clinicArray']).controls.length === 0) {
      this.frmNewUnit.controls['isClinic'].reset(false);
      this.addNew2();
    }
  }
  onAddHobby(children: any, valid: boolean) {
    console.log(valid);
    console.log(children);
    if (valid) {
      if (children.clinicName === '' || children.clinicName === ' ') {
        this.mainErrClinic = false;
        this.errMsgClinic = 'you left out a required field';
      } else {

        if (children != null) {
          children.value.readonly = true;
          console.log(children);
          // children.disabled = true;
          (<FormArray>this.clinicForm.controls['clinicArray'])
            .push(
            this.formBuilder.group({
              clinicName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
              clinicCapacity: [0, []],
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
    console.log(valid)
    console.log(val);
    if (valid) {
      console.log();
      if (val.unitName === '' || val.unitName === ' ' || val.unitAlias === ''
        || val.unitAlias === ' ' || val.unitDesc === '' || val.unitDesc === ' ') {
        this.mainErr = false;
        this.errMsg = 'you left out a required field';
      } else {
<<<<<<< HEAD
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
          // this.addNew();
          this.frmNewUnit.controls['isClinic'].reset(false);
          this.clinicForm.controls['clinicArray'] = this.formBuilder.array([]);
          this.frmNewUnit.reset();
        })
=======
        if (this.unit._id === undefined) {
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
            this.frmNewUnit.controls['isClinic'].reset(false);
            this.clinicForm.controls['clinicArray'] = this.formBuilder.array([]);
            this.frmNewUnit.reset();
          })

          this.mainErr = true;
        } else {
          let that = this;
          const clinicList = [];
          this.facilityObj.departments.forEach(function (item, i) {
            if (item._id === val.unitParent) {
              item.units.forEach((unit, u) => {
                if (unit._id === val._id) {
                  unit.name = val.unitName;
                  unit.shortName = val.unitAlias;
                  unit.description = val.unitDesc;
                  console.log(unit);

                  (<FormArray>that.clinicForm.controls['clinicArray'])
                    .controls.forEach((itemi: any, i) => {
                      console.log(itemi.value)
                      let isExisting = false;
                      unit.clinics.forEach((clinic, c) => {
                        if (clinic._id === itemi.value._id) {
                          isExisting = true;
                          clinic.clinicName = itemi.value.clinicName;
                          clinic.clinicCapacity = itemi.value.clinicCapacity;
                          console.log(clinic)
                        }
                      });
                      if (!isExisting) {
                        console.log(itemi.value)
                        unit.clinics.push(itemi.value);
                        console.log(unit.clinics)
                      }
                    })
                  let realClinics: any[] = [];
                  if (that.clinicsToDelele.length > 0) {
                    unit.clinics.forEach((clinic, k) => {
                      let shouldDelete = false;
                      that.clinicsToDelele.forEach((toDelete) => {
                        if (clinic._id === toDelete._id) {
                          shouldDelete = true;
                        }
                      })
                      if (!shouldDelete) {
                        realClinics.push(clinic)
                      }
                    })
>>>>>>> development

                    unit.clinics = realClinics;
                    console.log(unit.clinics);

                  }

                }
              })
            }
          });


          //update here
          this.facilityService.update(this.facilityObj).then((payload) => {
            this.facilityObj = payload;
            this.frmNewUnit.controls['isClinic'].reset(false);
            this.clinicForm.controls['clinicArray'] = this.formBuilder.array([]);
            this.frmNewUnit.reset();
            this.close_onClick();
          })


        }
      }
    } else {
      this.mainErr = false;
    }
  }

  close_onClick() {
    this.closeModal.emit(true);
    this.btnText = 'CREATE UNIT';
    this.unit = <any>{};
  }
}
