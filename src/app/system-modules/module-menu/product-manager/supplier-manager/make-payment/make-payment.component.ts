import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentChannels } from '../../../../../shared-module/helpers/global-config'
import { FacilitiesService, PurchaseEntryService } from '../../../../../services/facility-manager/setup/index';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from '../../../../../services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {
  mainErr = true;
  errMsg = 'you have unresolved errors';
  loadIndicatorVisible = false;
  payMethod = PaymentChannels;
  loginEmployee: any = <any>{};

  public frm_supplierPayment: FormGroup;

  @Input() selectedInvoice: any = <any>{};
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() paymentItem: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder,
    private systemModuleService: SystemModuleService,
    private locker: CoolLocalStorage,
    private purchaseEntryService: PurchaseEntryService,
    private facilityService: FacilitiesService,
    private _authFacadeService: AuthFacadeService) {
  }

  ngOnInit() {
    this.frm_supplierPayment = this.formBuilder.group({
      amount: ['', [<any>Validators.required]],
      payment_type: ['', [<any>Validators.required]],
      cheque_number: [''],
      transfer_number: ['']
    });
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      console.log(res);
      this.loginEmployee = res;
    });

  }

  close_onClick() {
    this.closeModal.emit(true);
  }



  login(valid) {
    if (valid) {
      console.log(this.selectedInvoice);
      const txn = {
        paidBy: this.loginEmployee._id,
        amount: this.frm_supplierPayment.controls['amount'].valueChanges,
        paymentChannel: this.frm_supplierPayment.controls['payment_type'].valueChanges,
        cheque: this.frm_supplierPayment.controls['cheque_number'].valueChanges,
        transactionNumber: this.frm_supplierPayment.controls['transfer_number'].valueChanges
      }
      let sum = 0;
      if (this.selectedInvoice.transactions !== undefined) {
        this.selectedInvoice.transactions = [];
      }
      this.selectedInvoice.transactions.push(txn);
      this.selectedInvoice.transactions.forEach(x => {
        sum += x.amount;
      });
      if (sum >= this.selectedInvoice.amountPaid) {
        this.selectedInvoice.paymentCompleted = true;
      }
      this.purchaseEntryService.patch(this.selectedInvoice._id, this.selectedInvoice).then(payload => {
        this.systemModuleService.announceSweetProxy('Payment made', 'success');
        this.paymentItem.emit(true);
      });
    } else {
      this.systemModuleService.announceSweetProxy('Missing field required', 'error');
    }

  }
}
