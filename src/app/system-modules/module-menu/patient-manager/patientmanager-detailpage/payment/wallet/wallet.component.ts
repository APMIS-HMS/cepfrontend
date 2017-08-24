import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  search: FormControl;

  constructor() { }

  ngOnInit() {
    this.search = new FormControl('', []);
  }
  fundWallet(){
    
  }
}
