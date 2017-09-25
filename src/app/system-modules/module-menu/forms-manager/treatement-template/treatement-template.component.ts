import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-treatement-template',
  templateUrl: './treatement-template.component.html',
  styleUrls: ['./treatement-template.component.scss']
})
export class TreatementTemplateComponent implements OnInit {

  public frmnewTemplate: FormGroup;
  newTemplate = false;

  isOrderSet = false;
  isDocumentation = true;

  showMedService = true;
  showLabService = false;
  showNursingCareService = false;
  showPhysicianOrderService = false;
  showProcedureService = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmnewTemplate = this.formBuilder.group({
      name: ['', [Validators.required]],
      diagnosis: [''],
      visibility: [''],
      isEditable: [''],
      type: ['', [<any>Validators.required]],
      docFrmList: [''],
      chkLab: [''],
      chkMed: [''],
      chkDiagnostic: [''],
      chkProcedure: [''],
      chkImmunization: [''],
      chkNursing: [''],
      chkPhysician: [''],
    });
  }

  newTemplate_show(){
    this.newTemplate = !this.newTemplate;
  }

}
