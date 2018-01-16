import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-doc-symptom',
  templateUrl: './doc-symptom.component.html',
  styleUrls: ['./doc-symptom.component.scss']
})
export class DocSymptomComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() symptom: EventEmitter<any> = new EventEmitter<any>();

  _tempSympton;

  addSymptomForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = 'symptoms';
  apmisLookupDisplayKey = 'name';
  apmisLookupText = '';

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.addSymptomForm = this.fb.group({
      symptom: ['', [<any>Validators.required]],
      symptomDuration: ['', [<any>Validators.required]]
    });

    this.addSymptomForm.controls['symptom'].valueChanges.subscribe(value => {

      if (value !== null && value.length === 0) {
        this.apmisLookupQuery = {
          name: { $regex: -1, '$options': 'i' },
          $limit: 100
        }
      } else {
        this.apmisLookupQuery = {
          name: { $regex: value, '$options': 'i' },
          $limit: 100
        }
      }
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  add_onClick() {
    this.symptom.emit(this._tempSympton);
    this.closeModal.emit(true);
  }


  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    const isExisting = false;
    this._tempSympton = value;
    console.log(this._tempSympton);



    // this.loginHMOListObject.companyCovers.forEach(item => {
    //   if (item._id === value._id) {
    //     isExisting = true;
    //   }
    // });
    // if (!isExisting) {
    //   this.selectedCompanyCover = value;
    // } else {
    //   this.selectedCompanyCover = <any>{};
    //   this._notification('Info', 'Selected HMO is already in your list of Company Covers');
    // }
  }

  login_show() {

  }

}
