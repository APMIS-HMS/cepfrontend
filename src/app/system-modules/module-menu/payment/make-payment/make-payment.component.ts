import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})

export class MakePaymentComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = 'you have unresolved errors';
  successMsg = 'Operation completed successfully';
  InvoiceTotal = 5000;
  success = false;
  public frmMakePayment: FormGroup;

  channel = new FormControl('', []);
  amount = new FormControl('', []);

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
