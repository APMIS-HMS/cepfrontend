import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-fluid-type',
  templateUrl: './fluid-type.component.html',
  styleUrls: ['./fluid-type.component.scss']
})
export class FluidTypeComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  public frm_addfluid: FormGroup;

  constructor(private formBuilder: FormBuilder){}

  ngOnInit() {
    this.frm_addfluid = this.formBuilder.group({
      fluidname: ['', [<any>Validators.required]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
}