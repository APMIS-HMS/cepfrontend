import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-tab',
  templateUrl: './store-tab.component.html',
  styleUrls: ['./store-tab.component.scss']
})
export class StoreTabComponent implements OnInit {

  people: any[] = [
    {firstname: "Ikechukwu"},
    {firstname: "Ikechukwu"},
    {firstname: "Ikechukwu"},
    {firstname: "Ikechukwu"}
  ];
  constructor() { }

  ngOnInit() {
  }

}
