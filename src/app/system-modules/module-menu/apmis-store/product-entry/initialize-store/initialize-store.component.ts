import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-initialize-store',
  templateUrl: './initialize-store.component.html',
  styleUrls: ['./initialize-store.component.scss']
})
export class InitializeStoreComponent implements OnInit {

  clickItemIndex: number;
	expand_row = false;
  showConfigureProduct = false;

  constructor() { }

  ngOnInit() {
  }

  close_onClick(e) {
		this.showConfigureProduct = false;
	}

  configureProduct(){
    this.showConfigureProduct = true;
  }

  item_to_show(i) {
		return this.clickItemIndex === i;
	}
	toggle_tr(itemIndex, direction) {
		if (direction === 'down' && itemIndex === this.clickItemIndex) {
			this.expand_row = false;
			this.clickItemIndex = -1;
		} else {
			this.clickItemIndex = itemIndex;
			this.expand_row = !this.expand_row;
		}
	}
}
