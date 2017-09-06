import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  search: FormControl;
  fundPopShow = false;
  selectedValue: string;
  
    wallets = [
      {value: 'cash', viewValue: 'Cash'},
      {value: 'paystack', viewValue: 'Paystack'},

    ];

  constructor() { }

  ngOnInit() {
    this.search = new FormControl('', []);
  }
  fundWallet(){
    this.fundPopShow = true;
  }
  onClose() {
    this.fundPopShow = false;
  }
}
