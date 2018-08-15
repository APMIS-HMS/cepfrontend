import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-antenatal-entry',
  templateUrl: './new-antenatal-entry.component.html',
  styleUrls: ['./new-antenatal-entry.component.scss']
})
export class NewAntenatalEntryComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = 'You have unresolved errors';
  public frm_UpdateCourse: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frm_UpdateCourse = this.formBuilder.group({
      register: ['', [<any>Validators.required]],
      patient: ['', [<any>Validators.required]],
      tt: ['', [<any>Validators.required]],
      comment: ['', [<any>Validators.required]],
      pregnancyAge: ['', [<any>Validators.required]],
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
