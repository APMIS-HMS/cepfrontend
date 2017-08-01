import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.scss']
})
export class LabComponent implements OnInit {

  pageInView = 'Laboratory';
  contentSecMenuShow = false;
  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

  workbenchContentArea = true;

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
