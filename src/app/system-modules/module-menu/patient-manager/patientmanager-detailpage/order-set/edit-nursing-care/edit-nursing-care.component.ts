import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OrderSetSharedService } from '../../../../../../services/facility-manager/order-set-shared-service';

@Component({
  selector: "app-edit-nursing-care",
  templateUrl: "./edit-nursing-care.component.html",
  styleUrls: ["./edit-nursing-care.component.scss"]
})
export class EditNursingCareComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  apmisLookupQuery = {};
  apmisLookupUrl = '';
  apmisLookupDisplayKey = '';
  apmisLookupText = '';
  newTemplate = true;
  addNursingCareForm: FormGroup;
  nursingCares: any = <any>[];

  constructor(
    private fb: FormBuilder,
    private _orderSetSharedService: OrderSetSharedService
  ) {}

  ngOnInit() {
    this.addNursingCareForm = this.fb.group({
      nursingCare: ['', [<any>Validators.required]]
    });
  }

  onClickAddNursingCare(valid: boolean, value: any) {
    if (valid) {
      const nursingCare = {
        name: value.nursingCare,
        comment: '',
        status: 'Not Done',
        completed: false
      };

      if (this.nursingCares.length > 0) {
        // Check if generic has been added already.
        const containsGeneric = this.nursingCares.filter(
          x => x.name === value.nursingCare
        );
        if (containsGeneric.length < 1) {
          this.nursingCares.push(nursingCare);
          this._orderSetSharedService.saveItem({
            nursingCares: this.nursingCares
          });
        }
      } else {
        this.nursingCares.push(nursingCare);
        this._orderSetSharedService.saveItem({
          nursingCares: this.nursingCares
        });
      }
      this.addNursingCareForm.reset();
    }
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
}
