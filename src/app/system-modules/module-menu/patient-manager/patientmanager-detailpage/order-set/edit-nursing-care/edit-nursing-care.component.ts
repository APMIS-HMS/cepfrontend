import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-nursing-care',
  templateUrl: './edit-nursing-care.component.html',
  styleUrls: ['./edit-nursing-care.component.scss']
})
export class EditNursingCareComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  
    apmisLookupQuery = {};
    apmisLookupUrl = '';
    apmisLookupDisplayKey = '';
    apmisLookupText = '';
  
    addNursingCareForm: FormGroup;
    
    constructor(private fb: FormBuilder) { }
  
    ngOnInit() {
      this.addNursingCareForm = this.fb.group({
        nursingCare: ['', [<any>Validators.required]]
      });
    }
  
    close_onClick() {
      this.closeModal.emit(true);
    }
  
  }
  