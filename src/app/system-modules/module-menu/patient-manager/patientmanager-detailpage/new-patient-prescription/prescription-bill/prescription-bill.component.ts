import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-prescription-bill',
  templateUrl: './prescription-bill.component.html',
  styleUrls: ['./prescription-bill.component.scss']
})
export class PrescriptionBillComponent implements OnInit {

  productAvailable = true;
  searchProduct = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

	onClickClose(e) {
		this.closeModal.emit(true);
  }
  
  onClickPrd(){
    this.productAvailable = false;
    this.searchProduct = true;
  }
}
