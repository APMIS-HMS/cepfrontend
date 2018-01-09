import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OrderSetSharedService } from '../../../../../../services/facility-manager/order-set-shared-service';

@Component({
  selector: 'app-edit-investigation',
  templateUrl: './edit-investigation.component.html',
  styleUrls: ['./edit-investigation.component.scss']
})
export class EditInvestigationComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  addInvestigationForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = 'investigations';
  apmisLookupDisplayKey = 'name';
  apmisLookupText = '';
  newTemplate = true;
  investigations: any = <any>[];

  constructor(
    private fb: FormBuilder,
     private _orderSetSharedService: OrderSetSharedService
  ) { }

  ngOnInit() {
    this.addInvestigationForm = this.fb.group({
      investigation: ['', [<any>Validators.required]]
    });
  }

  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    this.addInvestigationForm.controls['investigation'].setValue(value.name);
    console.log(value);
  }

  onClickAddInvestigation(valid: boolean, value: any) {
    if (valid) {
      const investigation = {
        name: value.investigation,
        comment: '',
        status: 'Not Done',
        completed: false,
      };

      if (this.investigations.length > 0) {
        // Check if generic has been added already.
        const containsGeneric = this.investigations.filter( x => investigation.name === x.name );
        if (containsGeneric.length < 1) {
          this.investigations.push(investigation);
          this._orderSetSharedService.saveItem({ investigations: this.investigations});
        }
      } else {
        this.investigations.push(investigation);
        this._orderSetSharedService.saveItem({ investigations: this.investigations});
      }
      this.addInvestigationForm.reset();
      this.addInvestigationForm.controls['investigation'].setValue('');
    }
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
}
