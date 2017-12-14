import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-template-nursing-care',
  templateUrl: './template-nursing-care.component.html',
  styleUrls: ['./template-nursing-care.component.scss']
})
export class TemplateNursingCareComponent implements OnInit {

  addNursingCareForm: FormGroup;
  addProcedureForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = '';
  apmisLookupDisplayKey = '';
  apmisLookupText = '';

  newTemplate = true;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addNursingCareForm = this.fb.group({
      nursingCare: ['', [<any>Validators.required]]
    });
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
