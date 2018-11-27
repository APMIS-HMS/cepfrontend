import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apmis-new-store',
  templateUrl: './apmis-new-store.component.html',
  styleUrls: ['./apmis-new-store.component.scss']
})
export class ApmisNewStoreComponent implements OnInit {

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
