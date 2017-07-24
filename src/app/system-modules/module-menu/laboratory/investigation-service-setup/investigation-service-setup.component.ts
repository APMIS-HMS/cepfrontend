import { Component, OnInit, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-investigation-service-setup',
  templateUrl: './investigation-service-setup.component.html',
  styleUrls: ['./investigation-service-setup.component.scss']
})
export class InvestigationServiceSetupComponent implements OnInit {

    isParent = true;
    isPanel = false;
    flyout = false;
    openModal = false;
    viewPanel = false;
    selectedPanel = true;
   foods = [
    {value: 'male', viewValue: 'name select'},
    {value: 'female', viewValue: 'name select'},
  ];
  constructor() { }

  ngOnInit() {
  }
panelShow() {
    this.isPanel = !this.isPanel;
  }
  clickParent() {
    this.isParent = !this.isParent;
  }
    close_onClick() {
    this.flyout = true;
  }
  flayoutClose() {
    this.flyout = false;
  }
   modal_onClick() {
    this.openModal = true;
  }
  closeModal()  {
    this.openModal = false;
  }
  viewPanelShow() {
    this.viewPanel = true;
    this.selectedPanel = false;
  }

  backIvestigation() {
    this.viewPanel = false;
    this.selectedPanel = true;
  }

}
