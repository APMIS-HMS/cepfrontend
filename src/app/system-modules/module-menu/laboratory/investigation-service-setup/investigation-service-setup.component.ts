import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-investigation-service-setup',
  templateUrl: './investigation-service-setup.component.html',
  styleUrls: ['./investigation-service-setup.component.scss']
})
export class InvestigationServiceSetupComponent implements OnInit {
   foods = [
    {value: 'male', viewValue: 'name select'},
    {value: 'female', viewValue: 'name select'},
  ];
  constructor() { }

  ngOnInit() {
  }

}
