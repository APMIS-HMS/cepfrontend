import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-product-movement',
  templateUrl: './product-movement.component.html',
  styleUrls: ['./product-movement.component.scss']
})
export class ProductMovementComponent implements OnInit {

  tab_outbound = true;
  tab_inbound = false;
  storeLocation:FormControl = new FormControl();
  storeName:FormControl = new FormControl();

  constructor(private router: Router) { }

  ngOnInit() {
  }
  tab_click(tab){
    if(tab==='outbound'){
      this.tab_outbound = true;
      this.tab_inbound = false;
    } else if(tab==='inbound'){
      this.tab_outbound = false;
      this.tab_inbound = true;
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
