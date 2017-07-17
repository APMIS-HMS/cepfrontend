import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lab-setup',
  templateUrl: './lab-setup.component.html',
  styleUrls: ['./lab-setup.component.scss']
})
export class LabSetupComponent implements OnInit {

   foods = [
    {value: 'male', viewValue: 'name select'},
    {value: 'female', viewValue: 'name select'},
  ];

  constructor() { }

  ngOnInit() {
  }

}
