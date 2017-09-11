import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-template-nursing-care',
  templateUrl: './template-nursing-care.component.html',
  styleUrls: ['./template-nursing-care.component.scss']
})
export class TemplateNursingCareComponent implements OnInit {

  addNursingCareForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addNursingCareForm = this.fb.group({
      nursingCare: ['', [<any>Validators.required]]
    });
  }

}
