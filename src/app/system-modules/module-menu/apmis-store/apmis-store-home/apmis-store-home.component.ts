import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apmis-store-home',
  templateUrl: './apmis-store-home.component.html',
  styleUrls: ['./apmis-store-home.component.scss']
})
export class ApmisStoreHomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  changeRoute(value: string) {
    this.router.navigate(['/dashboard/store/' + value]).then(
      payload => {
      }
    ).catch(error => { 
    });
  }

}
