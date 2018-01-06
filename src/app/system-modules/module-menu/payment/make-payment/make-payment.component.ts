import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService, MakePaymentService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import {
  WalletTransaction, TransactionType, EntityType, TransactionDirection, TransactionMedium, TransactionStatus, PaymentPlan
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
  isPartPay = true;
  isWaved = false;

  totalAmountPaid = 0;
  outOfPocketAmountPaid = 0;
  paymentChannels = PaymentChannels;
  selectedFacility: Facility = <Facility>{};
  selectedBillItem: BillModel = <BillModel>{};
  user: any = <any>{};
  disableBtn = true;
  isProcessing = false;
  isCash = false;

  loading = false;
  tabWallet = true;
  tabInsurance = false;
  tabCompany = false;
  tabFamily = false;

  transaction: WalletTransaction = <WalletTransaction>{};
  mainErr = true;
  errMsg = 'you have unresolved errors';
  successMsg = 'Operation completed successfully';
  InvoiceTotal = 5000;
  bAmount = 0;
  success = false;
  public frmMakePayment: FormGroup;

  patientInsuranceLists = [];
  patientCompanyLists = [];
  patientFamilyLists = [];

  balance;
  amount = new FormControl('', []);
  selectOutOfPocket = new FormControl('', []);
  selectWaved = new FormControl('', []);
  amountInsurance = new FormControl('', []);
  balanceInsurance = new FormControl('', []);
  amountCompany = new FormControl('', []);
  balanceCompany = new FormControl('', []);
  amountFamily = new FormControl('', []);
  balanceFamily = new FormControl('', []);

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
    this.getPatientInsuranceLists();
    this.getPatientCompanyLists();
    this.getPatientFamilyLists();
    this.balance = new FormControl(this.cost, []);
    this.amount.valueChanges.subscribe(value => {
      var bal = this.cost - value;
      if (bal >= 0) {
        this.balance.setValue(bal);
        console.log(this.balance.value);
      } else {
        this.amount.setValue(this.cost);
        this._notification('Error', "Balance cannot be lesser than zero");
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

  getPatientInsuranceLists() {
    this.patientInsuranceLists = this.selectedPatient.paymentPlan.filter(x => x.planType == PaymentPlan.insurance);
  }

  getPatientCompanyLists() {
    this.patientCompanyLists = this.selectedPatient.paymentPlan.filter(x => x.planType == PaymentPlan.company);
  }

  getPatientFamilyLists() {
    this.patientInsuranceLists = this.selectedPatient.paymentPlan.filter(x => x.planType == PaymentPlan.family);
  }

  onOutOfPocketPartPay() {
    this.isPartPay = !this.isPartPay;
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

  tabWallet_click() {
    this.tabWallet = true;
    this.tabCompany = false;
    this.tabFamily = false;
    this.tabInsurance = false;
  }
  tabCompany_click() {
    this.tabWallet = false;
    this.tabCompany = true;
    this.tabFamily = false;
    this.tabInsurance = false;
  }
  tabFamily_click() {
    this.tabWallet = false;
    this.tabCompany = false;
    this.tabFamily = true;
    this.tabInsurance = false;
  }
  tabInsurance_click() {
    this.tabWallet = false;
    this.tabCompany = false;
    this.tabFamily = false;
    this.tabInsurance = true;
  }

  onExactCharges(event: any) {
    var isChecked = event.target.checked;
    this.onOutOfPocketPartPay();
    if (isChecked) {
      this.amount.setValue(this.cost);
      this.balance.setValue(0);
    }
  }

  onWaverCharges(event: any) {
    this.isWaved = event.target.checked;
  }

  onOutOfPocket() {
    var paymentValue = {};
    if (!this.isWaved) {
      var plan = this.selectedPatient.paymentPlan.filter(x => x.planType == PaymentPlan.outOfPocket);
      paymentValue = {
        "paymentMethod": plan[0],
        "amountPaid": this.amount.value
      }
    } else {
      paymentValue = {
        "paymentMethod": PaymentPlan.waved,
        "amountPaid": this.amount.value
      }
      this.amount .setValue(this.cost);
      this.balance.setValue(0);
    }
    this.makePayment(paymentValue);
  }

  onInsuranceCover() { }

  onFamilyCover() { }

  onCompanyCover() { }


  makePayment(val) {
    console.log(val);
    this.isProcessing = true;
    var paymantObj = {};
    if (this.isInvoicePage == false) {
      paymantObj = {
        "inputedValue": {
          "paymentMethod": val.paymentMethod,
          "amountPaid": val.amountPaid,
          "balance": this.balance.value,
          "cost": this.cost,
          "transactionType": TransactionType[TransactionType.Dr]
        },
        "billGroups": this.billGroups,
        "selectedPatient": this.selectedPatient,
        "selectedFacility": this.selectedFacility,
        "discount": this.discount,
        "subTotal": this.subTotal,
        "checkBillitems": this.checkBillitems,
        "listedBillItems": this.listedBillItems,
        "isInvoicePage": false
      }
    } else {
      paymantObj = {
        "inputedValue": {
          "paymentMethod": val.paymentMethod,
          "amountPaid": val.amountPaid,
          "balance": this.balance.value,
          "cost": this.cost,
          "transactionType": TransactionType[TransactionType.Dr]
        },
        "invoice": this.invoice,
        "selectedPatient": this.selectedPatient,
        "isInvoicePage": true
      }
    }
    console.log(paymantObj);
    this._makePaymentService.create(paymantObj).then(payload => {
      this.personValueChanged.emit(payload.data);
      this.isProcessing = false;
      this.close_onClick();
      this._notification('Success', 'Payment successfull.');
    });
  }

  private _notification(type: String, text: String): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

}
