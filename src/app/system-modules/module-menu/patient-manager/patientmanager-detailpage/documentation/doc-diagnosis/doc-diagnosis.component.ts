import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-doc-diagnosis',
  templateUrl: './doc-diagnosis.component.html',
  styleUrls: ['./doc-diagnosis.component.scss']
})
export class DocDiagnosisComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  _tempDiagnosis;

  diagnoses = [
    {
      name : 'Epiphora',
      code : 'H04.2'
    },
    {
      name : 'Dacryoadenitis',
      code : 'H04.0'
    },
    {
      name : 'Exophthalmic conditions',
      code : 'H05.2'
    },
    {
      name : 'Deformity of orbit',
      code : 'H05.3'
    }
  ]

  tab_all = true;
  tab_favourite = false;
  tab_patient = false;
  tab_recent = false;

  addDiagnosisForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = 'diagnosises';
  apmisLookupDisplayKey = 'name';
  apmisLookupText = '';

  favorite_type = new FormControl();
  recently_type = new FormControl();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addDiagnosisForm = this.fb.group({
      type: ['', [<any>Validators.required]],
      diagnosis: ['', [<any>Validators.required]]
    });
  }


  tabAll_click(){
    this.tab_all = true;
    this.tab_favourite = false;
    this.tab_patient = false;
    this.tab_recent = false;
  }
  tabFavourite_click(){
    this.tab_all = false;
    this.tab_favourite = true;
    this.tab_patient = false;
    this.tab_recent = false;
  }
  tabPatient_click(){
    this.tab_all = false;
    this.tab_favourite = false;
    this.tab_patient = true;
    this.tab_recent = false;
  }
  tabRecent_click(){
    this.tab_all = false;
    this.tab_favourite = false;
    this.tab_patient = false;
    this.tab_recent = true;
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    this._tempDiagnosis = value;
    console.log(this._tempDiagnosis);
  }

  add_onClick() {
    if (this._tempDiagnosis.name && this._tempDiagnosis.code) {
      this.diagnoses.push(this._tempDiagnosis);
    }
  }

  deleteDiagonis(item) {
    this.diagnoses = this.diagnoses.filter(e => e !== item);
  }

  done() {
    this.closeModal.emit(true);
  }
}
