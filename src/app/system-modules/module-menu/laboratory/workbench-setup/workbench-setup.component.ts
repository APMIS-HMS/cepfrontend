import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-workbench-setup',
  templateUrl: './workbench-setup.component.html',
  styleUrls: ['./workbench-setup.component.scss']
})
export class WorkbenchSetupComponent implements OnInit {

  openModal = false;

   foods = [
    {value: 'male', viewValue: 'name select'},
    {value: 'female', viewValue: 'name select'},
  ];

  constructor() { }

  ngOnInit() {
  }
  close_onClick() {
    this.openModal = true;
  }
  closeModal()  {
    this.openModal = false;
  }
}
