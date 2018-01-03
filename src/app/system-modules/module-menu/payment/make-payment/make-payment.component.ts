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

import { PaymentChannels } from '../../../../shared-module/helpers/global-config'

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
  @Input() isInvoicePage: any = <any>{};


  paymentChannels = PaymentChannels;
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
  balance;
  bAmount = 0;
  success = false;
  public frmMakePayment: FormGroup;

  
  amount = new FormControl('', []);
  

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
    this.balance = new FormControl(this.cost, []);
    this.amount.valueChanges.subscribe(value => {
      var bal = this.cost - value;
      if(bal >= 0){
        this.balance.setValue(bal);
        console.log(this.balance);
      }else{
        this.amount.setValue(this.cost);
        this._notification('Error',"Balance cannot be lesser than zero");
      }
    });
    // this.channel.valueChanges.subscribe(value => {
    //   this.disableBtn = false;
    //   if (value == "Cash") {
    //     this.isCash = true;
    //   } else {
    //     this.isCash = false;
    //   }
    // });
  }

  // calculateBalance(ev){
  //   console.log(ev.target.value);
  //   var bal = this.cost - ev.target.value;
  //   if(bal >= 0){
  //     this.balance = bal;
  //     console.log(this.balance);
  //   }else{
  //     this._notification('Error',"Balance cannot be lesser than zero");
  //   }
  // }

  close_onClick() {
    this.closeModal.emit(true);
  }

  makePayment() {
    this.isProcessing = true;
    if (this.isInvoicePage == false) {
      var paymantObj = {
        "inputedValue": {
          "channel": TransactionMedium[TransactionMedium.Wallet],
          "txnType": TransactionType[TransactionType.Dr],
          "txnStatus": TransactionStatus.Complete,
          "amountPaid": this.amount.value,
          "balance": this.balance,
          "cost": this.cost,
        },
        "billGroups": this.billGroups,
        "selectedPatient": this.selectedPatient,
        "selectedFacility": this.selectedFacility,
        "discount": this.discount,
        "subTotal": this.subTotal,
        "checkBillitems": this.checkBillitems,
        "listedBillItems": this.listedBillItems,
        "isInvoicePage":true
      }

      this._makePaymentService.create(paymantObj).then(payload => {
        this.personValueChanged.emit(payload.data);
        this.isProcessing = false;
        this.close_onClick();
        this._notification('Success', 'Payment successfull.');
      });
    } else {
      var paymantObj2 = {
        "inputedValue": {
          "channel": TransactionMedium[TransactionMedium.Wallet],
          "txnType": TransactionType[TransactionType.Dr],
          "txnStatus": TransactionStatus.Complete,
          "amountPaid": this.amount.value,
          "balance": this.balance,
          "cost": this.cost,
        },
        "invoice": this.invoice,
        "selectedPatient": this.selectedPatient,
        "isInvoicePage":true
      }
      this._makePaymentService.create(paymantObj2).then(payload => {
        this.personValueChanged.emit(payload.data);
        this.isProcessing = false;
        this.close_onClick();
        this._notification('Success', 'Payment successfull.');
      });
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
