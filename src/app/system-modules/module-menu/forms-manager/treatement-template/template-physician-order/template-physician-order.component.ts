import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-template-physician-order',
  templateUrl: './template-physician-order.component.html',
  styleUrls: ['./template-physician-order.component.scss']
})
export class TemplatePhysicianOrderComponent implements OnInit {

  addPhysicianOrderForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addPhysicianOrderForm = this.fb.group({
      physicianOrder: ['', [<any>Validators.required]]
    });
  }

}
  