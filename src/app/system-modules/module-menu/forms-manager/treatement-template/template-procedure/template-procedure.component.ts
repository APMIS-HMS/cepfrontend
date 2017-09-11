import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-template-procedure',
  templateUrl: './template-procedure.component.html',
  styleUrls: ['./template-procedure.component.scss']
})
export class TemplateProcedureComponent implements OnInit {

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

}
