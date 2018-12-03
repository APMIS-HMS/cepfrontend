import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {

  showViewInvoice = false;
  showNewSupplier= false;
  main_content = true;
  constructor() { }

  ngOnInit() {
  }

  close_onClick(e) {
		this.showViewInvoice = false;
  }

  viewInvoice(){
    this.showViewInvoice = true;
  }

  onShowNewSupplier(){
    this.showNewSupplier = true;
    this.main_content = false;
  }
}
