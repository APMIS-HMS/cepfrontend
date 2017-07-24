import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-investigation-setup',
  templateUrl: './investigation-setup.component.html',
  styleUrls: ['./investigation-setup.component.scss']
})
export class InvestigationSetupComponent implements OnInit {
  openModal = false;
   foods = [
    {value: 'male', viewValue: 'name select'},
    {value: 'female', viewValue: 'name select'},
  ];

  constructor() { }

  ngOnInit() {
  }
closeModal()  {
    this.openModal = false;
  }
   modal_onClick() {
    this.openModal = true;
  }
}
