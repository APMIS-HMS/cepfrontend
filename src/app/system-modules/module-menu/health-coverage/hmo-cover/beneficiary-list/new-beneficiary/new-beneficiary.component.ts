import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-beneficiary',
  templateUrl: './new-beneficiary.component.html',
  styleUrls: ['./new-beneficiary.component.scss']
})
export class NewBeneficiaryComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = 'You have unresolved errors';
  public frm_UpdateCourse: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frm_UpdateCourse = this.formBuilder.group({
      fname: ['', [<any>Validators.required]],
      lname: ['', [<any>Validators.required]],
      gender: ['', [<any>Validators.required]],
      id: ['', [<any>Validators.required]],
      role: ['', [<any>Validators.required]],
      status: ['', [<any>Validators.required]],
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  view() {
    
  }
}
