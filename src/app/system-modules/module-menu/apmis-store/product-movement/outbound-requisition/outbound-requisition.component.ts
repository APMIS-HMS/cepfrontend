import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-outbound-requisition',
  templateUrl: './outbound-requisition.component.html',
  styleUrls: ['./outbound-requisition.component.scss']
})
export class OutboundRequisitionComponent implements OnInit {

  check:FormControl = new FormControl();
  storeLocation:FormControl = new FormControl();
  storeName:FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

}
