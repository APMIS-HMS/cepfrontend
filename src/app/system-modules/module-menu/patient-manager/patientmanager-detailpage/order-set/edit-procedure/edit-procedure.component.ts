import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-procedure',
  templateUrl: './edit-procedure.component.html',
  styleUrls: ['./edit-procedure.component.scss']
})
export class EditProcedureComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  addInvestigationForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = '';
  apmisLookupDisplayKey = '';
  apmisLookupText = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addInvestigationForm = this.fb.group({
      investigation: ['', [<any>Validators.required]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
  