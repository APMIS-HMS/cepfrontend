import { Component, OnInit, EventEmitter, Output, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-medication',
  templateUrl: './edit-medication.component.html',
  styleUrls: ['./edit-medication.component.scss']
})
export class EditMedicationComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  addPrescriptionForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = '';
  apmisLookupDisplayKey = '';
  apmisLookupText = '';

  newTemplate = true;

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
