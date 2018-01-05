import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-doc-symptom',
  templateUrl: './doc-symptom.component.html',
  styleUrls: ['./doc-symptom.component.scss']
})
export class DocSymptomComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  addSymptomForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = 'symptoms';
  apmisLookupDisplayKey = 'name';
  apmisLookupText = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addSymptomForm = this.fb.group({
      symptom: ['', [<any>Validators.required]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    let isExisting = false;
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
}
