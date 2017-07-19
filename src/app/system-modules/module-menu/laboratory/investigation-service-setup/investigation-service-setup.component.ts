import { Component, OnInit, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-investigation-service-setup',
  templateUrl: './investigation-service-setup.component.html',
  styleUrls: ['./investigation-service-setup.component.scss']
})
export class InvestigationServiceSetupComponent implements OnInit {

    isParent = false;
    isPanel = false;
    flyout = false;
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
}
