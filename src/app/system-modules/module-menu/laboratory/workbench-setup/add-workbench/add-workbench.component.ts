import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-workbench',
  templateUrl: './add-workbench.component.html',
  styleUrls: ['./add-workbench.component.scss']
})
export class AddWorkbenchComponent implements OnInit {
  
  foods = [
    {value: 'male', viewValue: 'name select'},
    {value: 'female', viewValue: 'name select'},
  ];

  constructor() { }

  ngOnInit() {
  }

}
