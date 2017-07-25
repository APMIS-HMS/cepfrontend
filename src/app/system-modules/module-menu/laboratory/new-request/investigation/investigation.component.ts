import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-investigation',
  templateUrl: './investigation.component.html',
  styleUrls: ['./investigation.component.scss']
})
export class InvestigationComponent implements OnInit {

  isParent = false;
    isPanel = true;
    foods = [
    {value: 'male', viewValue: 'Fale'},
    {value: 'female', viewValue: 'Female'},
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

}
