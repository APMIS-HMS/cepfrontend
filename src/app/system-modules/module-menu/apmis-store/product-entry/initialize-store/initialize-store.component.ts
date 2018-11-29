import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-initialize-store',
  templateUrl: './initialize-store.component.html',
  styleUrls: ['./initialize-store.component.scss']
})
export class InitializeStoreComponent implements OnInit {

  item_to_show =  true;
	expand_row = false;
	showConfigureProduct = false;
	newBatchEntry = false;

  constructor() { }

  ngOnInit() {
  }

  close_onClick(e) {
		this.showConfigureProduct = false;
		this.newBatchEntry = false;
	}

  configureProduct(){
		this.showConfigureProduct = true;
	}
	
	showNewBatch(){
		this.newBatchEntry = true;
	}

  clickItemIndex() {
		return this.item_to_show = !this.item_to_show;
	}
	
}
