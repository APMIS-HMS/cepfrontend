import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-template-lab',
  templateUrl: './template-lab.component.html', 
  styleUrls: ['./template-lab.component.scss']
})
export class TemplateLabComponent implements OnInit {

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

}
