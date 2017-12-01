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
  apmisLookupUrl = '';
  apmisLookupDisplayKey = '';
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

}
  