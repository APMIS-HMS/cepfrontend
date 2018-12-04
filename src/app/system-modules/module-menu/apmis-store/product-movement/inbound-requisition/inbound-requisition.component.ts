import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'; 

@Component({
  selector: 'app-inbound-requisition',
  templateUrl: './inbound-requisition.component.html',
  styleUrls: ['./inbound-requisition.component.scss']
})
export class InboundRequisitionComponent implements OnInit {

  check:FormControl = new FormControl(); 

  constructor() { } 

  ngOnInit() { 
  }

}
