import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-stores',
  templateUrl: './store-stores.component.html',
  styleUrls: ['./store-stores.component.scss']
})
export class StoreStoresComponent implements OnInit {

  tab_store = true;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  tab_click(tab){
    if(tab==='store'){
      this.tab_store = true;
    }
  } 

  changeRoute(value: string) {
    this.router.navigate(['/dashboard/store/' + value]).then(
      payload => {
      }
    ).catch(error => { 
    });
  }

}
