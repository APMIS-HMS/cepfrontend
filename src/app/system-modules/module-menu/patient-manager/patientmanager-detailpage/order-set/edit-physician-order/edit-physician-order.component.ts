import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-physician-order',
  templateUrl: './edit-physician-order.component.html',
  styleUrls: ['./edit-physician-order.component.scss']
})
export class EditPhysicianOrderComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  addProcedureForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = '';
  apmisLookupDisplayKey = '';
  apmisLookupText = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addProcedureForm = this.fb.group({
      procedure: ['', [<any>Validators.required]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
  