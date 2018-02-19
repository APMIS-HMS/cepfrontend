import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EMAIL_REGEX, PHONE_REGEX, ALPHABET_REGEX } from 'app/shared-module/helpers/global-config';

@Component({
  selector: 'app-biodata-update',
  templateUrl: './biodata-update.component.html',
  styleUrls: ['./biodata-update.component.scss']
})
export class BiodataUpdateComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  show = false;
  errMsg: string;
  mainErr = true;
  public frmPerson: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmPerson = this.formBuilder.group({
      persontitle: [new Date(), [<any>Validators.required]],
      firstname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50), Validators.pattern(ALPHABET_REGEX)]],
      lastname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50), Validators.pattern(ALPHABET_REGEX)]],
      gender: [[<any>Validators.minLength(2)]],
      dob: [new Date(), [<any>Validators.required]],
      motherMaidenName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50), Validators.pattern(ALPHABET_REGEX)]],
      securityQuestion: ['', [<any>Validators.required]],
      securityAnswer: ['', [<any>Validators.required]],
      // email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
      phone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
