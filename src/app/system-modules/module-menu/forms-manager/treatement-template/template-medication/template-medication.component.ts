import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-template-medication',
  templateUrl: './template-medication.component.html',
  styleUrls: ['./template-medication.component.scss']
})
export class TemplateMedicationComponent implements OnInit {

  addPrescriptionForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = '';
  apmisLookupDisplayKey = '';
  apmisLookupText = '';

  currentDate: Date = new Date();
  minDate: Date = new Date();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addPrescriptionForm = this.fb.group({
      strength: ['', [<any>Validators.required]],
      route: ['', [<any>Validators.required]],
      drug: ['', [<any>Validators.required]],
      frequency: ['', [<any>Validators.required]],
      duration: [0, [<any>Validators.required]],
      durationUnit: ['', [<any>Validators.required]],
      refillCount: [''],
      startDate: [this.currentDate],
      specialInstruction: ['']
  });
  this.apmisLookupUrl = 'drug-generic-list-api';


  this.apmisLookupDisplayKey = 'details';
  }

}
