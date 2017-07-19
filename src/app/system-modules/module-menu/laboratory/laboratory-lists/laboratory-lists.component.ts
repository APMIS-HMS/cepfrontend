import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-laboratory-lists',
  templateUrl: './laboratory-lists.component.html',
  styleUrls: ['./laboratory-lists.component.scss']
})
export class LaboratoryListsComponent implements OnInit {
    selectedValue: string;
    lists = [{
      "fullname":"subair adams ohikere",
      "sex":"male",
      "doctor":"gordons",
      "date":"9-9-2009",
      "location":"subair adams ohikere",
      "diagnosis":"very diagnised",
      "samples":"sample taken",
      "isexternal":"yes",
      "payment":"paid",
    }]
  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
