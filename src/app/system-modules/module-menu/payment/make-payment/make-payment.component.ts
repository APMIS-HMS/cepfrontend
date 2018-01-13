import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService, MakePaymentService, FacilitiesService, PersonService } from '../../../../services/facility-manager/setup/index';
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
  isPartPayInsurance = true;
  isWaved = false;
  isExact = true;
  isExactInsurance = false;
  isExactCompany = false;
  isExactFamily = false;

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
  bAmount;
  success = false;
  public frmMakePayment: FormGroup;

  patientInsuranceLists = [];
  patientCompanyLists = [];
  patientFamilyLists = [];

  balance;
  wavedDescription = new FormControl('', []);
  amount = new FormControl('', []);
  selectOutOfPocket = new FormControl('', []);
  selectWaved = new FormControl('', []);
  amountInsurance = new FormControl('', []);
  balanceInsurance = new FormControl('', []);
  amountCompany = new FormControl('', []);
  balanceCompany = new FormControl('', []);
  amountFamily = new FormControl('', []);
  balanceFamily = new FormControl('', []);

  companyPlan = new FormControl('', []);
  familyPlan = new FormControl('', []);
  insurancePlan = new FormControl('', []);

  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private _invoiceService: InvoiceService,
    private toastr: ToastsManager,
    private _makePaymentService: MakePaymentService,
    private facilityService: FacilitiesService,
    private personService: PersonService) {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
  }

  ngOnInit() {
    this.user = <User>this.locker.getObject('auth');
    this.getPatientCovers();
    this.balance = new FormControl(this.cost, []);
    this.balanceInsurance = new FormControl(this.cost, []);
    this.balanceCompany = new FormControl(this.cost, []);
    this.balanceFamily = new FormControl(this.cost, []);
    if (this.isExact == true) {
      this.amount.setValue(this.cost);
      this.balance.setValue(0);
    }
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
    this.amountInsurance.valueChanges.subscribe(value => {
      var bal = this.cost - value;
      if (bal >= 0) {
        this.balanceInsurance.setValue(bal);
      } else {
        this.amountInsurance.setValue(this.cost);
        this._notification('Error', "Balance cannot be lesser than zero");
      }
    });

    this.amountCompany.valueChanges.subscribe(value => {
      var bal = this.cost - value;
      if (bal >= 0) {
        this.balanceCompany.setValue(bal);
      } else {
        this.amountCompany.setValue(this.cost);
        this._notification('Error', "Balance cannot be lesser than zero");
      }
    });

    this.amountFamily.valueChanges.subscribe(value => {
      var bal = this.cost - value;
      if (bal >= 0) {
        this.balanceFamily.setValue(bal);
      } else {
        this.amountFamily.setValue(this.cost);
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

  getPatientCovers() {
    if (this.selectedPatient.paymentPlan != undefined) {
      this.patientInsuranceLists = this.selectedPatient.paymentPlan.filter(x => x.planType == PaymentPlan.insurance);
      this.patientCompanyLists = this.selectedPatient.paymentPlan.filter(x => x.planType == PaymentPlan.company);
      this.patientFamilyLists = this.selectedPatient.paymentPlan.filter(x => x.planType == PaymentPlan.family);
    } else {
      this._notification('Error', "No payment plan is attached to patient");
    }
    console.log(this.patientInsuranceLists);
  }

  getPatientCompanyLists() {

  }

  getPatientFamilyLists() {
    //this.patientInsuranceLists = this.selectedPatient.paymentPlan.filter(x => x.planType == PaymentPlan.family);
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
    this.isExact = event.target.checked;
    if (this.isExact) {
      this.amount.setValue(this.cost);
      this.balance.setValue(0);
    }
  }

  onWaverCharges(event: any) {
    this.isWaved = event.target.checked;
    if (this.isWaved == true) {
      this.amount.setValue(0);
      this.balance.setValue(this.cost);
    }
  }

  onInsuranceExactCharges(event: any) {
    this.isExactInsurance = event.target.checked;
    if (this.isExactInsurance) {
      this.amountInsurance.setValue(this.cost);
      this.balance.setValue(0);
    }
  }

  onCompanyExactCharges(event: any) {
    this.isExactCompany = event.target.checked;
    if (this.isExactCompany) {
      this.amountCompany.setValue(this.cost);
      this.balance.setValue(0);
    }
  }

  onFamilyExactCharges(event: any) {
    this.isExactFamily = event.target.checked;
    if (this.isExactFamily) {
      this.amountFamily.setValue(this.cost);
      this.balanceFamily.setValue(0);
    }
  }

  onOutOfPocket() {
    if ((this.amount.value != '' && this.amount.value != 0) || this.isWaved == true) {
      if (this.selectedPatient.personDetails.wallet != undefined) {
        if (this.selectedPatient.personDetails.wallet.balance < this.cost) {
          this._notification('Info', "You donot have sufficient balance to make this payment");
        } else {
          var paymentValue = {};
          var plan = this.selectedPatient.paymentPlan.filter(x => x.planType == PaymentPlan.outOfPocket);
          if (this.isExact) {
            paymentValue = {
              "paymentMethod": plan[0],
              "amountPaid": this.amount.value
            }
          } else if (this.isWaved) {
            let objPlanType = {
              "planType": PaymentPlan.waved
            }
            paymentValue = {
              "paymentMethod": objPlanType,
              "amountPaid": this.amount.value
            }
          } else {
            paymentValue = {
              "paymentMethod": plan[0],
              "amountPaid": this.amount.value
            }
          }
          this.bAmount = this.balance.value;
          this.makePayment(paymentValue);
        }
      } else {
        this._notification('Info', "You donot have sufficient balance to make this payment");
      }
    } else {
      this._notification('Error', "Please enter a valid amount");
    }
  }

  onInsuranceCover() {
    if (this.insurancePlan.value.planDetails != undefined) {
      this.facilityService.get(this.insurancePlan.value.planDetails._id, {}).then((payload: any) => {
        if (payload.wallet != undefined) {
          if (payload.wallet.balance < this.cost) {
            this._notification('Info', "No sufficient balance to make this payment");
          } else {
            var paymentValue = {};
            if (this.isExactInsurance) {
              paymentValue = {
                "paymentMethod": this.insurancePlan.value,
                "amountPaid": this.amountInsurance.value
              }
            } else {
              paymentValue = {
                "paymentMethod": this.insurancePlan.value,
                "amountPaid": this.amountInsurance.value
              }
            }
            this.bAmount = this.balanceInsurance.value;
            console.log(this.bAmount);
            this.makePayment(paymentValue);
          }
        } else {
          this._notification('Info', "You donot have sufficient balance to make this payment");
        }
      });
    } else {
      this._notification('Error', "You have not selected an insurance cover");
    }


  }

  onFamilyCover() {
    if (this.familyPlan.value.planDetails != undefined) {
      this.personService.get(this.familyPlan.value.planDetails._id, {}).then((payload: any) => {
        if (payload.wallet != undefined) {
          if (payload.wallet.balance < this.cost) {
            this._notification('Info', "No sufficient balance to make this payment");
          } else {
            var paymentValue = {};
            if (this.isExactFamily) {
              paymentValue = {
                "paymentMethod": this.familyPlan.value,
                "amountPaid": this.amountFamily.value
              }
            } else {
              paymentValue = {
                "paymentMethod": this.familyPlan.value,
                "amountPaid": this.amountFamily.value
              }
            }
            this.bAmount = this.balanceFamily.value;
            console.log(this.bAmount);
            this.makePayment(paymentValue);
          }
        } else {
          this._notification('Info', "You donot have sufficient balance to make this payment");
        }
      });
    } else {
      this._notification('Error', "You have not selected a family cover");
    }
  }

  onCompanyCover() {
    if (this.companyPlan.value.planDetails != undefined) {
      this.facilityService.get(this.companyPlan.value.planDetails._id, {}).then((payload: any) => {
        if (payload.wallet != undefined) {
          if (payload.wallet.balance < this.cost) {
            this._notification('Info', "No sufficient balance to make this payment");
          } else {
            var paymentValue = {};
            if (this.isExactCompany) {
              paymentValue = {
                "paymentMethod": this.companyPlan.value,
                "amountPaid": this.amountCompany.value
              }
            } else {
              paymentValue = {
                "paymentMethod": this.companyPlan.value,
                "amountPaid": this.amountCompany.value
              }
            }
            this.bAmount = this.balanceCompany.value;
            console.log(this.bAmount);
            this.makePayment(paymentValue);
          }
        } else {
          this._notification('Info', "You donot have sufficient balance to make this payment");
        }
      });
    } else {
      this._notification('Error', "You have not selected a company cover");
    }

  }


  makePayment(val) {
    console.log(val);
    this.isProcessing = true;
    var paymantObj:any = {};
    if (this.isInvoicePage == false) {
      paymantObj = {
        "inputedValue": {
          "paymentMethod": val.paymentMethod,
          "amountPaid": val.amountPaid,
          "balance": this.bAmount,
          "cost": this.cost,
          "isWaved": this.isWaved,
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
      if (this.isWaved) {
        paymantObj.reason =  this.wavedDescription.value;
      }
      if(this.bAmount == 0){
        paymantObj.transactionStatus = TransactionStatus.Complete;
      }
    } else {
      paymantObj = {
        "inputedValue": {
          "paymentMethod": val.paymentMethod,
          "amountPaid": val.amountPaid,
          "balance": this.bAmount,
          "cost": this.cost,
          "isWaved": this.isWaved,
          "transactionType": TransactionType[TransactionType.Dr]
        },
        "invoice": this.invoice,
        "selectedPatient": this.selectedPatient,
        "isInvoicePage": true
      }
      if (this.isWaved) {
        paymantObj.reason =  this.wavedDescription.value;
      }
      if(this.bAmount == 0){
        paymantObj.transactionStatus = TransactionStatus.Complete;
      }
    }
    console.log(paymantObj);
    this._makePaymentService.create(paymantObj).then(payload => {
      this.personValueChanged.emit(payload.data);
      this.isProcessing = false;
      this.balance.setValue(0);
      this.close_onClick();
      if(!payload.data.isWaved){
        this._notification('Success', 'Payment successfull.');
      }else{
        this._notification('Success', 'Payment waved successfull.');
      }
      
    }, error => {
      this._notification('Error', 'Fail to make payment pls try again later');
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
