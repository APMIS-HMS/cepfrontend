import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-outbound-transfer',
  templateUrl: './outbound-transfer.component.html',
  styleUrls: ['./outbound-transfer.component.scss']
})
export class OutboundTransferComponent implements OnInit {

  check:FormControl = new FormControl();
  storeLocation:FormControl = new FormControl();
  storeName:FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

}
