import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent implements OnInit {
    foods = [
    {value: 'male', viewValue: 'Fale'},
    {value: 'female', viewValue: 'Female'},
  ];

  constructor() { }

  ngOnInit() {
  }


}
