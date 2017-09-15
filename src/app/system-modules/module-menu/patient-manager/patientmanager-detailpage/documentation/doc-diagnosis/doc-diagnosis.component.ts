import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-doc-diagnosis',
  templateUrl: './doc-diagnosis.component.html',
  styleUrls: ['./doc-diagnosis.component.scss']
})
export class DocDiagnosisComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  tab_all = true;
  tab_favourite = false;
  tab_patient = false;
  tab_recent = false;
  
  addDiagnosisForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = '';
  apmisLookupDisplayKey = '';
  apmisLookupText = '';

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

}
  