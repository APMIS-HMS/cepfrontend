import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-antenatal-pg2',
  templateUrl: './new-antenatal-pg2.component.html',
  styleUrls: ['./new-antenatal-pg2.component.scss']
})
export class NewAntenatalPg2Component implements OnInit {

  public frm_UpdateCourse: FormGroup;
  @Output() newpg2: EventEmitter<boolean> = new EventEmitter<boolean>();

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
  save_onClick() {
    this.newpg2.emit(true);
  }

}
