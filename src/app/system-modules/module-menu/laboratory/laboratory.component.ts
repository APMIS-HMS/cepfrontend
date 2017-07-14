import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-laboratory',
  templateUrl: './laboratory.component.html',
  styleUrls: ['./laboratory.component.scss']
})
export class LaboratoryComponent implements OnInit {
    pageInView = 'Laboratory';
    contentSecMenuShow = false;

  constructor() { }

  ngOnInit() {
  }

  	navItemClick() {
		this.contentSecMenuShow = false;
	}
	contentSecMenuToggle() {
		this.contentSecMenuShow = !this.contentSecMenuShow;
	}
	innerMenuHide(e) {
		if (
			e.srcElement.className === 'inner-menu1-wrap' ||
			e.srcElement.localName === 'i' ||
			e.srcElement.id === 'innerMenu-ul'
		) { } else {
			this.contentSecMenuShow = false;
		}
	}

}
