import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService, MakePaymentService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import {
  WalletTransaction, TransactionType, EntityType, TransactionDirection, TransactionMedium, TransactionStatus
} from './../../../../models/facility-manager/setup/wallet-transaction';
import { Patient, Facility, BillItem, Invoice, BillModel, User } from '../../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { PaymentChannel } from '../../../../shared-module/helpers/global-config'

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})

export class MakePaymentComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() personValueChanged = new EventEmitter();
  @Input() selectedPatient: any = <any>{};
  @Input() checkBillitems: any = <any>{};
  @Input() listedBillItems: any = <any>{};
  @Input() billGroups: any = <any>{};
  @Input() cost: any = <any>{};
  @Input() discount: any = <any>{};
  @Input() subTotal: any = <any>{};
  @Input() invoice: any = <any>{};
  @Input() isVoicePage: boolean = <boolean>{};


  paymentChannels = PaymentChannel;
  selectedFacility: Facility = <Facility>{};
  selectedBillItem: BillModel = <BillModel>{};
  user: any = <any>{};
  disableBtn = true;
  isProcessing = false;
  isCash = false;

  transaction: WalletTransaction = <WalletTransaction>{};
  mainErr = true;
  errMsg = 'you have unresolved errors';
  successMsg = 'Operation completed successfully';
  InvoiceTotal = 5000;
  success = false;
  public frmMakePayment: FormGroup;

  channel = new FormControl('', []);
  amount = new FormControl('', []);
  balance = new FormControl('', []);

  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private _invoiceService: InvoiceService,
    private toastr: ToastsManager,
    private _makePaymentService: MakePaymentService,
    private facilityService: FacilitiesService) {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
  }

  ngOnInit() {
    this.user = <User>this.locker.getObject('auth');
    // this.amount.valueChanges.subscribe(value => {
    //   if (parseFloat(value) < this.cost) {
    //     this.disableBtn = true;
    //     let bal = value - this.cost;
    //     this.balance.setValue(bal);
    //     console.log(this.disableBtn);
    //   } else {
    //     this.disableBtn = false;
    //     console.log(this.disableBtn);
    //   }
    // });
    // this.channel.valueChanges.subscribe(value => {
    //   this.disableBtn = false;
    //   if (value == "Cash") {
    //     this.isCash = true;
    //   } else {
    //     this.isCash = false;
    //   }
    // });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  makePayment() {
    if (this.isVoicePage == false) {
      this.isProcessing = true;
      var paymantObj = {
        "inputedValue": {
          "channel": TransactionMedium[TransactionMedium.Wallet],
          "txnType": TransactionType[TransactionType.Dr],
          "txnStatus": TransactionStatus.Complete,
          "cost": this.cost
        },
        "billGroups": this.billGroups,
        "selectedPatient": this.selectedPatient,
        "selectedFacility": this.selectedFacility,
        "discount": this.discount,
        "subTotal": this.subTotal,
        "checkBillitems": this.checkBillitems,
        "listedBillItems": this.listedBillItems
      }

      this._makePaymentService.create(paymantObj).then(payload => {
        console.log(payload);
        this.personValueChanged.emit(payload.data);
        this.isProcessing = false;
        this.close_onClick();
        this._notification('Success', 'Payment successfull.');
      });
    } else {
      this.checkBillitems.paymentCompleted = true;
      this.checkBillitems.payments.push({
        "transactionType": TransactionType[TransactionType.Dr],
        "amount": this.cost,
        "transactionMedium": TransactionMedium[TransactionMedium.Wallet],
        "transactionStatus": TransactionStatus.Complete
      });
      this._invoiceService.update(this.checkBillitems).then(payload => {
        this._notification('Success', "Payment for invoice: " + payload.invoiceNo + " was successfull");
      }, err => {
        this._notification('Error', err)
      })
    }
  }

  private _notification(type: String, text: String): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

}
