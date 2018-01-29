import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OrderSetSharedService } from '../../../../../services/facility-manager/order-set-shared-service';

@Component({
  selector: 'app-template-lab',
  templateUrl: './template-lab.component.html',
  styleUrls: ['./template-lab.component.scss']
})
export class TemplateLabComponent implements OnInit {
  addInvestigationForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = 'investigations';
  apmisLookupDisplayKey = 'name';
  apmisLookupText = '';
  newTemplate = true;
  investigations: any = [];
  selectedInvestigation: any = <any>{};

  constructor(
    private fb: FormBuilder,
    private _orderSetSharedService: OrderSetSharedService,
  ) { }

  ngOnInit() {
    this.addInvestigationForm = this.fb.group({
      investigation: ['', [<any>Validators.required]]
    });
  }

  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    this.selectedInvestigation = value;
    this.addInvestigationForm.controls['investigation'].setValue(value.name);
    console.log(value);
  }

  onClickAddInvestigation(valid: boolean, value: any) {
    console.log(value);
    if (valid) {
      this.selectedInvestigation.comment = '';
      this.selectedInvestigation.status = 'Not Done';
      this.selectedInvestigation.completed = false;

      this.investigations.push(this.selectedInvestigation);
      this._orderSetSharedService.saveItem({ investigations: this.investigations});

      this.apmisLookupText = '';
      this.addInvestigationForm.reset();
      this.addInvestigationForm.controls['investigation'].setValue('');
    }
  }
}
