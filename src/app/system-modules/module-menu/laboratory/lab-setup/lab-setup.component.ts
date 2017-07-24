import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lab-setup',
  templateUrl: './lab-setup.component.html',
  styleUrls: ['./lab-setup.component.scss']
})
export class LabSetupComponent implements OnInit {
  loadIndicatorVisible = false;
  workbench = true;
  investigationService = false;
  investigation = false;
  addWorkbench = false;
   foods = [
    {value: 'male', viewValue: 'name select'},
    {value: 'female', viewValue: 'name select'},
  ];

  constructor() { 
  
  }

  ngOnInit() {
  }
  workBenchSetup() {
    this.workbench = true;
    this.investigationService = false;
    this.investigation = false;
  }
  investigationServiceSetup() {
    this.investigationService = true;
    this.workbench = false;
    this.investigation = false;
  }
  investigationSetup() {
    this.investigationService = false;
    this.workbench = false;
    this.investigation = true;
  }
 
}
