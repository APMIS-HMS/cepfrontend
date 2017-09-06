import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-payment-plan',
  templateUrl: './patient-payment-plan.component.html',
  styleUrls: ['./patient-payment-plan.component.scss']
})
export class PatientPaymentPlanComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';
  
  walletPlan = new FormControl('', Validators.required);
  walletPlanCheck = new FormControl('');
  hmoPlan = new FormControl('', Validators.required);
  hmoPlanId = new FormControl('', Validators.required);
  hmoPlanCheck = new FormControl('');
  ccPlan = new FormControl('', Validators.required);
  ccPlanId = new FormControl('', Validators.required);
  ccPlanCheck = new FormControl('');
  familyPlanId = new FormControl('', Validators.required);
  familyPlanCheck = new FormControl('');

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
