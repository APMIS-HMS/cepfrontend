import { CoolLocalStorage } from 'angular2-cool-storage';
import {
  WalletTransaction, TransactionType, EntityType, TransactionDirection, TransactionMedium
} from './../../../../../../models/facility-manager/setup/wallet-transaction';
import { PayStackService } from './../../../../../../services/facility-manager/setup/paystack.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FLUTTERWAVE_PUBLIC_KEY, PAYSTACK_CLIENT_KEY } from '../../../../../../shared-module/helpers/global-config';
import { PersonService, FacilitiesService } from '../../../../../../services/facility-manager/setup/index';
// import  '../../../../../../../assets/libs/paystack.js';
import crop from './paystack.js';
import paystackInline from './paystack-inline.js';
import { Facility, User } from 'app/models';
declare var paystack: any;
// declare var callPayStack: any;
@Component({
  selector: "app-wallet",
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit, AfterViewInit {
  @Input() patient;
  person: any;
  transactions: any[] = [];
  search: FormControl;
  fundAmount: FormControl;
  selectedValue: string;
  selectedFacility: Facility;
  user: any = <any>{};
  withPaystack: boolean = true;
  withFlutterwave: boolean = true;
  flutterwaveClientKey: string = FLUTTERWAVE_PUBLIC_KEY;
  paystackClientKey: string = PAYSTACK_CLIENT_KEY;
  refKey: string;
  ePayment: boolean = false;
  ePaymentMethod: string = 'Flutterwave';

  wallets = [
    { value: 'cash', viewValue: 'Cash' },
    { value: 'paystack', viewValue: 'Paystack' }
  ];

  constructor(
    private personService: PersonService,
    private _payStackService: PayStackService,
    private _locker: CoolLocalStorage,
    private _facilityService: FacilitiesService
  ) {}

  ngOnInit() {
    this.selectedFacility = <Facility>this._locker.getObject('miniFacility');
    this.user = <User>this._locker.getObject('auth');
    this.fundAmount = new FormControl(0, [<any>Validators.required]);
    this.search = new FormControl('', []);
    this.search.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        if (value.length > 0) {
          const copiedTransactions = JSON.parse(
            JSON.stringify(this.person.wallet.transactions)
          );
          this.transactions = copiedTransactions.filter(function(el) {
            return (
              el.amount === value ||
              el.refCode === value ||
              el.description.toLowerCase().includes(value.toLowerCase()) ||
              el.transactionType.toLowerCase() === value.toLowerCase()
            );
          });
        } else {
          this.transactions = this.person.wallet.transactions.reverse().slice(0, 5);
        }
      });

    this.personService.get(this.patient.personId, {}).then(payload => {
      console.log(payload);
      if (payload.wallet === undefined) {
        payload.wallet = {
          balance: 0,
          ledgerBalance: 0,
          transactions: []
        };
        this.personService.update(payload).then(pay => {
          this.person = pay;
        });
      } else {
        this.person = payload;
        this.transactions = payload.wallet.transactions.reverse().slice(0, 5);
      }
    });

    this.refKey = (this.user ? this.user.data._id.substr(20) : '') + new Date().getTime();

    // let formData = { type: 'customers' };
    // this._payStackService.paystack(formData).then(payload => {
    //   console.log(payload);
    // })
    // this.verifyTransaction('T706272350859262');
  }
  ngAfterViewInit(): void {
    // crop();
  }
  // fundWallet() {
  //   crop();
  // }
  verifyTransaction(reference) {
    let formData = { type: 'verifyTransaction', reference: reference };
    this._payStackService.paystack(formData).then(payload => {
      console.log(payload);
    });
  }
  fundWithElectronic() {
    console.log(this.patient);
    let retVal = paystackInline(
      this.patient.personDetails.email,
      this.fundAmount.value,
      this.patient.personDetails.phoneNumber,
      this.paystackCallback,
      this
    );
  }
  onClose() {}

  paystackCallback(response) {
    console.log(response);
    // let that = this;
    this.verifyTransaction(response.reference);
  }

  fundWallet() {
    console.log(this.fundAmount);
    if (this.fundAmount.valid && this.fundAmount.value >= 500) {
      let walletTransaction: WalletTransaction = {
        paymentMethod: 'Cash',
        transactionType: TransactionType.Cr,
        transactionMedium: TransactionMedium.Wallet,
        amount: this.fundAmount.value,
        description: 'Funding wallet via cash payment',
        sourceId: this.user.data.personId,
        destinationId: this.person._id,
        source: EntityType.Person,
        destination: EntityType.Person,
        transactionDirection: TransactionDirection.PersonToPerson
      };

      console.log(walletTransaction);

      this.personService
        .fundWallet(walletTransaction)
        .then((res: any) => {
          console.log(res);
          if (res.body.status === 'success') {
            this.person = res.body.data;
            this.transactions = this.person.wallet.transactions.reverse().slice(0, 5);
          } else {
            console.log(res.body.message);
            this._notification('Error', res.body.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      let text = 'Please enter amount above 500 naira';
      this._notification('Info', text);
    }
  }

  paymentDone(paymentRes) {
    console.log(paymentRes);
    let flutterwaveRes = {
      data: paymentRes.data.data,
      tx: {
        charged_amount: paymentRes.tx.charged_amount,
        customer: paymentRes.tx.customer,
        flwRef: paymentRes.tx.flwRef,
        txRef: paymentRes.tx.txRef,
        orderRef: paymentRes.tx.orderRef,
        paymentType: paymentRes.tx.paymentType,
        raveRef: paymentRes.tx.raveRef,
        status: paymentRes.tx.status
      }
    };

    let walletTransaction: WalletTransaction = {
      ref: this.ePaymentMethod === 'Flutterwave' ? flutterwaveRes : paymentRes,
      paymentMethod: 'e-Payment',
      ePaymentMethod: 'Flutterwave',
      transactionType: TransactionType.Cr,
      transactionMedium: TransactionMedium.Wallet,
      amount: this.fundAmount.value,
      description: 'Funding wallet via e-Payment using flutterwave',
      sourceId: this.person._id,
      destinationId: this.person._id,
      source: EntityType.Person,
      destination: EntityType.Person,
      transactionDirection: TransactionDirection.PersonToPerson
    };

    this.personService
      .fundWallet(walletTransaction)
      .then((res: any) => {
        console.log(res);
        if (res.body.status === 'success') {
          this.ePayment = false;
          this.fundAmount.setValue(0);
          this.person = res.body.data;
          this.transactions = this.person.wallet.transactions.reverse().slice(0, 5);
          this._notification('Success', 'Your wallet has been credited successfully.');
        } else {
          console.log(res.body.message);
          this._notification('Error', res.body.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  onClickEPayment() {
    if (this.fundAmount.valid && this.fundAmount.value >= 500) {
      this.ePayment = !this.ePayment;
    } else {
      let text = 'Please enter amount above 500 naira';
      this._notification('Info', text);
    }
  }

  paymentCancel() {
    console.log('Cancelled');
  }

  // Notification
  private _notification(type: string, text: string): void {
    this._facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
