import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-store-home',
  templateUrl: './store-home.component.html',
  styleUrls: ['./store-home.component.scss']
})
export class StoreHomeComponent implements OnInit {

  Ql_toggle = false;

  constructor() { }

  ngOnInit() {
  }

  toggleQl(){
    this.Ql_toggle = !this.Ql_toggle;
  }

}
