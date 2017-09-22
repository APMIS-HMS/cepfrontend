import { CoolLocalStorage } from 'angular2-cool-storage';
import { WalletTransaction, TransactionType, EntityType, TransactionDirection, TransactionMedium } from './../../../../../../models/facility-manager/setup/wallet-transaction';
import { PayStackService } from './../../../../../../services/facility-manager/setup/paystack.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PersonService } from '../../../../../../services/facility-manager/setup/index';
// import  '../../../../../../../assets/libs/paystack.js';
import crop from './paystack.js';
import paystackInline from './paystack-inline.js';
import { Facility } from 'app/models';
declare var paystack: any;
// declare var callPayStack: any;
@Component({
  selector: 'app-wallet',
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

  wallets = [
    { value: 'cash', viewValue: 'Cash' },
    { value: 'paystack', viewValue: 'Paystack' }
  ];

  constructor(private personService: PersonService, private _payStackService: PayStackService, private _locker: CoolLocalStorage) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this._locker.getObject('miniFacility');
    this.fundAmount = new FormControl('', []);
    this.search = new FormControl('', []);
    this.search.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        if (value.length > 0) {
          const copiedTransactions = JSON.parse(JSON.stringify(this.person.wallet.transactions));
          this.transactions = copiedTransactions.filter(function (el) {
            return el.amount == value ||
              el.refCode == value ||
              el.description.toLowerCase().includes(value.toLowerCase()) ||
              el.transactionType.toLowerCase() == value.toLowerCase()
          });
        } else {
          this.transactions = this.person.wallet.transactions;
        }
      });

    this.personService.get(this.patient.personId, {}).then(payload => {

      if (payload.wallet === undefined) {
        payload.wallet = {
          balance: 0,
          ledgerBalance: 0,
          transactions: []
        };
        this.personService.update(payload).then(pay => {
          this.person = pay;
        })
      } else {
        this.person = payload;
        this.transactions = payload.wallet.transactions;
      }
    });

    // let formData = { type: 'customers' };
    // this._payStackService.paystack(formData).then(payload => {
    //   console.log(payload);
    // })
    this.verifyTransaction('T706272350859262');
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
    })
  }
  fundWithElectronic() {
    console.log(this.patient);
    let retVal = paystackInline(this.patient.personDetails.email, this.fundAmount.value, this.patient.personDetails.phoneNumber, this.paystackCallback, this);
  }
  onClose() {
  }
  paystackCallback(response) {
    console.log(response);
    // let that = this;
    this.verifyTransaction(response.reference);
  }
  fundWallet() {
    let walletTransaction: WalletTransaction = {
      transactionType: TransactionType.Cr,
      transactionMedium: TransactionMedium.Wallet,
      amount: this.fundAmount.value,
      description: 'payment for investigation',
      sourceId: this.selectedFacility._id,
      destinationId:this.person._id,
      source:EntityType.Facility,
      destination:EntityType.Person,
      transactionDirection:TransactionDirection.FacilityToPerson
    };

    this.personService.walletTransaction(walletTransaction).then(payload => {
      this.person = payload.body;
      this.transactions = this.person.wallet.transactions;
    })
  }

}
