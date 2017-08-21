import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.scss']
})
export class LabComponent implements OnInit {
  pageInView = 'Laboratory';
  contentSecMenuShow = false;
  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

  requestContentArea = false;
  workbenchContentArea = false;
  investigationContentArea = false;
  pricingContentArea = false;
  panelContentArea = false;
  reportContentArea = false;

  constructor(
    private _router: Router,
  ) { }

  ngOnInit() {
    const page: string = this._router.url;
		this.checkPageUrl(page);
  }
  
	contentSecMenuToggle() {
		this.contentSecMenuShow = !this.contentSecMenuShow;
  }
  
  checkPageUrl(param: string) {
		if (param.includes('request')) {
			this.requestContentArea = true;
      this.workbenchContentArea = false;
      this.investigationContentArea = false;
      this.pricingContentArea = false;
      this.panelContentArea = false;
      this.reportContentArea = false;
		} else if (param.includes('workbench')) {
			this.requestContentArea = false;
      this.workbenchContentArea = true;
      this.investigationContentArea = false;
      this.pricingContentArea = false;
      this.panelContentArea = false;
      this.reportContentArea = false;
		} else if (param.includes('investigation-pricing')) {
			this.requestContentArea = false;
      this.workbenchContentArea = false;
      this.investigationContentArea = false;
      this.pricingContentArea = true;
      this.panelContentArea = false;
      this.reportContentArea = false;
		} else if (param.includes('investigation')) {
			this.requestContentArea = false;
      this.workbenchContentArea = false;
      this.investigationContentArea = true;
      this.pricingContentArea = false;
      this.panelContentArea = false;
      this.reportContentArea = false;
		} else if(param.includes('panel')) {
      this.requestContentArea = false;
      this.workbenchContentArea = false;
      this.investigationContentArea = false;
      this.pricingContentArea = false;
      this.panelContentArea = true;
      this.reportContentArea = false;
    } else if(param.includes('report')) {
      this.requestContentArea = false;
      this.workbenchContentArea = false;
      this.investigationContentArea = false;
      this.pricingContentArea = false;
      this.panelContentArea = false;
      this.reportContentArea = true;
    }
	}
	// innerMenuHide(e) {
	// 	if (
	// 		e.srcElement.className === 'inner-menu1-wrap' ||
	// 		e.srcElement.localName === 'i' ||
	// 		e.srcElement.id === 'innerMenu-ul'
	// 	) { } else {
	// 		this.contentSecMenuShow = false;
	// 	}
  // }
  
  // navRequest(){
  //   this.requestContentArea = true;
  //   this.workbenchContentArea = false;
  //   this.investigationContentArea = false;
  //   this.pricingContentArea = false;
  //   this.panelContentArea = false;
  //   this.reportContentArea = false;
  // }
  // navWorkbench(){
  //   this.requestContentArea = false;
  //   this.workbenchContentArea = true;
  //   this.investigationContentArea = false;
  //   this.pricingContentArea = false;
  //   this.panelContentArea = false;
  //   this.reportContentArea = false;
  // }
  // navInvestigation(){
  //   this.requestContentArea = false;
  //   this.workbenchContentArea = false;
  //   this.investigationContentArea = true;
  //   this.pricingContentArea = false;
  //   this.panelContentArea = false;
  //   this.reportContentArea = false;
  // }
  // navPricing(){
  //   this.requestContentArea = false;
  //   this.workbenchContentArea = false;
  //   this.investigationContentArea = false;
  //   this.pricingContentArea = true;
  //   this.panelContentArea = false;
  //   this.reportContentArea = false;
  // }
  // navPanel(){
  //   this.requestContentArea = false;
  //   this.workbenchContentArea = false;
  //   this.investigationContentArea = false;
  //   this.pricingContentArea = false;
  //   this.panelContentArea = true;
  //   this.reportContentArea = false;
  // }
  // navReport(){
  //   this.requestContentArea = false;
  //   this.workbenchContentArea = false;
  //   this.investigationContentArea = false;
  //   this.pricingContentArea = false;
  //   this.panelContentArea = false;
  //   this.reportContentArea = true;
  // }

}
