import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'; 

@Component({
  selector: 'app-inbound-transfer',
  templateUrl: './inbound-transfer.component.html',
  styleUrls: ['./inbound-transfer.component.scss']
})
export class InboundTransferComponent implements OnInit {

  check:FormControl = new FormControl(); 

  constructor() { } 

  ngOnInit() { 
  }

}
