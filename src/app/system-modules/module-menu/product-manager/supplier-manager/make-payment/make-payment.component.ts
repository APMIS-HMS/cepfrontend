import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {
  mainErr = true;
  errMsg = 'you have unresolved errors';
  loadIndicatorVisible = false;
  public frm_supplierPayment: FormGroup;

  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.frm_supplierPayment = this.formBuilder.group({
      supplier: ['', [<any>Validators.required]],
      amount: ['', [<any>Validators.required]],
      payment_type: ['', [<any>Validators.required]],
      cheque_number: ['', [<any>Validators.required]],
      transfer_number: ['', [<any>Validators.required]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  login() {

  }
}
