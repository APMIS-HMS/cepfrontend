import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prescribed-table',
  templateUrl: './prescribed-table.component.html',
  styleUrls: ['./prescribed-table.component.scss']
})
export class PrescribedTableComponent implements OnInit {

  billShow = false;
  constructor() { }

  ngOnInit() {
  }

  onBillShow(){
    this.billShow = true;
  }

  close_onClick(e) {
		this.billShow = false;
	}

}
