import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-stores',
  templateUrl: './store-stores.component.html',
  styleUrls: ['./store-stores.component.scss']
})
export class StoreStoresComponent implements OnInit {

  tab_store = true;

  constructor() { }

  ngOnInit() {
  }

  tab_click(tab){
    if(tab==='store'){
      this.tab_store = true;
    }
  } 

}
