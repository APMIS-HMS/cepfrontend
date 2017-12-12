import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService, InvoiceService, BillingService } from '../../../../services/facility-manager/setup/index';
import {
  WalletTransaction, TransactionType, EntityType, TransactionDirection, TransactionMedium, TransactionStatus
} from './../../../../models/facility-manager/setup/wallet-transaction';
import { Patient, Facility, BillItem, Invoice, BillModel, User } from '../../../../models/index';

import { PaymentChannel } from '../../../../shared-module/helpers/global-config'

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})

export class MakePaymentComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedPatient: any = <any>{};
  @Input() checkBillitems: any = <any>{};
  @Input() listedBillItems: any = <any>{};
  @Input() billGroups: any = <any>{};
  @Input() cost: any = <any>{};
  @Input() discount: any = <any>{};
  @Input() subTotal: any = <any>{};


  paymentChannels = PaymentChannel;
  selectedFacility: Facility = <Facility>{};
  selectedBillItem: BillModel = <BillModel>{};
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
    private _patientService: PatientService,
    private _invoiceService: InvoiceService,
    private _billingService: BillingService,
    private router: Router) {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
  }

  ngOnInit() {
    this.amount.valueChanges.subscribe(value => {
      if (parseFloat(value) < this.cost) {
        this.disableBtn = true;
        let bal = value - this.cost;
        this.balance.setValue(bal);
        console.log(this.disableBtn);
      } else {
        this.disableBtn = false;
        console.log(this.disableBtn);
      }
    });
    this.channel.valueChanges.subscribe(value => {
      this.disableBtn = false;
      if (value == "Cash") {
        this.isCash = true;
      } else {
        this.isCash = false;
      }
    })
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  onGenerateInvoice() {
    this.isProcessing = true;
    const billGroup: Invoice = <Invoice>{ billingIds: [] };
    billGroup.facilityId = this.selectedFacility._id;
    billGroup.patientId = this.selectedPatient._id;

    this.billGroups.forEach((itemg, g) => {
      itemg.bills.forEach((itemb: BillModel, b) => {
        if (itemb.isChecked) {
          billGroup.billingIds.push({ billingId: itemb._id });
        }
      });
    });

    if (billGroup.billingIds.length > 0) {
      billGroup.totalDiscount = this.discount;
      billGroup.totalPrice = this.subTotal;
      billGroup.grandAmount = this.cost;
      console.log(billGroup);
      console.log(this.checkBillitems);
      console.log(this.listedBillItems);
      this._invoiceService.create(billGroup).then(payload => {
        var len = this.checkBillitems.length - 1;
        var len2 = this.listedBillItems.length - 1;
        var filterCheckedBills = [];
        for (var x = len; x >= 0; x--) {
          for (var x2 = len2; x2 >= 0; x2--) {
            let len3 = this.listedBillItems[x2].billItems.length - 1;
            for (var x3 = len3; x3 >= 0; x3--) {
              if (this.listedBillItems[x2].billItems[x3]._id == this.checkBillitems[x]) {
                this.listedBillItems[x2].billItems[x3].isInvoiceGenerated = true;
                filterCheckedBills.push(this.listedBillItems[x2]);
                console.log(filterCheckedBills);
                console.log("This is verify");
                if (x == 0) {
                  let len4 = filterCheckedBills.length - 1;
                  for (var x4 = len4; x4 >= 0; x4--) {
                    this._billingService.update(filterCheckedBills[x4]).then(pd => {
                      console.log(pd);
                      if (x4 == 0) {
                        this.onDebitWallet();
                      }
                    });
                  }
                }
              }
            }
          }
        }
        this.router.navigate(['/dashboard/payment/invoice', payload.patientId]);
      }, error => {
        console.log(error);
      });
    }
  }

  onDebitWallet() {
    if (this.selectedPatient.personDetails.wallet != undefined) {
      if (this.selectedPatient.personDetails.wallet.transactions != undefined) {
        this.transaction.transactionType = TransactionType.Dr;
        this.transaction.amount = this.cost;
        this.transaction.transactionMedium = this.channel.value;
        this.transaction.transactionStatus = TransactionStatus.Complete;
        this.selectedPatient.personDetails.wallet.transactions.push(this.transaction);
        let currentBalance = this.selectedPatient.personDetails.wallet.balance - this.cost;
        this.selectedPatient.personDetails.wallet.balance = currentBalance;
        this.selectedPatient.personDetails.wallet.ledgerBalance = currentBalance;
        this._patientService.update(this.selectedPatient).then(payload => {
          console.log(payload);
          this.isProcessing = false;
        })

      }
    }
  }

  makePayment() {
    this.onGenerateInvoice();
  }

}
