import { Component, OnInit, EventEmitter, Output, Input  } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-unknown-patient-merge',
  templateUrl: './unknown-patient-merge.component.html',
  styleUrls: ['./unknown-patient-merge.component.scss']
})
export class UnknownPatientMergeComponent implements OnInit {

  apmisLookupUrl = 'patient-search';
	apmisLookupText = '';
	apmisLookupQuery: any = {};
	apmisLookupDisplayKey = 'personDetails.firstName';
	apmisLookupImgKey = 'personDetails.profileImageObject.thumbnail';
	apmisLookupOtherKeys = [
		'personDetails.lastName',
		'personDetails.firstName',
		'personDetails.apmisId',
		'personDetails.email'
	];


  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
 apmisLookupHandleSelectedItem(e){

  }
}
