import { Component, OnInit, Input } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms"

@Component({
  selector: 'app-initialize-store',
  templateUrl: './initialize-store.component.html',
  styleUrls: ['./initialize-store.component.scss']
})
export class InitializeStoreComponent implements OnInit {

  myform: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    
  }

}
