import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PersonService } from '../../../../../../services/facility-manager/setup/index';
@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  @Input() patient;
  person: any;
  transactions: any[] = [];
  search: FormControl;
  fundPopShow = false;
  selectedValue: string;
  
    wallets = [
      {value: 'cash', viewValue: 'Cash'},
      {value: 'paystack', viewValue: 'Paystack'},

    ];

  constructor(private personService: PersonService) { }

  ngOnInit() {
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
    })
  }
  fundWallet() {
    this.fundPopShow = true;
    const personId = this.person._id;
    const transactionType = 'Dr';
    const transactionSource = 'POS';
    const amount = 500;
    const description = 'payment for investigation'

    this.personService.walletTransaction(personId, transactionType, transactionSource, amount, description).then(payload => {
      this.person = payload.body;
      this.transactions = this.person.wallet.transactions;
    })
  }
  onClose() {
    this.fundPopShow = false;
  }
}
