import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-antenatal-pg1',
  templateUrl: './new-antenatal-pg1.component.html',
  styleUrls: ['./new-antenatal-pg1.component.scss']
})
export class NewAntenatalPg1Component implements OnInit {

  public frm_UpdateCourse: FormGroup;
  @Output() newpg1: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frm_UpdateCourse = this.formBuilder.group({
      register: ['', [<any>Validators.required]],
      patient: ['', [<any>Validators.required]],
      tt: ['', [<any>Validators.required]],
      parity: ['', [<any>Validators.required]],
      comment: ['', [<any>Validators.required]],
      pregnancyAge: ['', [<any>Validators.required]],
    });
  }
  next_onClick() {
    this.newpg1.emit(true);
  }

}
