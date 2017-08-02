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

  requestContentArea = true;
  workbenchContentArea = false;
  investigationContentArea = false;
  pricingContentArea = false;
  panelContentArea = false;

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
  
  navRequest(){
    this.requestContentArea = true;
    this.workbenchContentArea = false;
    this.investigationContentArea = false;
    this.pricingContentArea = false;
    this.panelContentArea = false;
  }
  navWorkbench(){
    this.requestContentArea = false;
    this.workbenchContentArea = true;
    this.investigationContentArea = false;
    this.pricingContentArea = false;
    this.panelContentArea = false;
  }
  navInvestigation(){
    this.requestContentArea = false;
    this.workbenchContentArea = false;
    this.investigationContentArea = true;
    this.pricingContentArea = false;
    this.panelContentArea = false;
  }
  navPricing(){
    this.requestContentArea = false;
    this.workbenchContentArea = false;
    this.investigationContentArea = false;
    this.pricingContentArea = true;
    this.panelContentArea = false;
  }
  navPanel(){
    this.requestContentArea = false;
    this.workbenchContentArea = false;
    this.investigationContentArea = false;
    this.pricingContentArea = false;
    this.panelContentArea = true;
  }

}
