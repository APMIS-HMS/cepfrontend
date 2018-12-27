import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-prescription-bill',
  templateUrl: './prescription-bill.component.html',
  styleUrls: ['./prescription-bill.component.scss']
})
export class PrescriptionBillComponent implements OnInit {

  productAvailable = true;
  searchProduct = false;
  searchShow = false;
  searchList = true;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

	onClickClose(e) {
		this.closeModal.emit(true);
  }

  onShowSearchResult(){
    this.searchShow = true;
    this.searchList = false;
  }
  onClickPrd(){
    this.productAvailable = !this.productAvailable;
    this.searchProduct = true;
  }
}
