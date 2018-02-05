import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  pgMenuToggle = false;

  constructor(private router: Router) { }

  ngOnInit() {
    const page: string = this.router.url;
    this.checkPageUrl(page);
  }
  pgMenu_click(){
    this.pgMenuToggle = !this.pgMenuToggle;
  }
  private checkPageUrl(param: string) { 
    if (param.includes('facility/modules')) {
    } else if (param.includes('facility/departments')) {}
  }
  changeRoute(value: string) {
    this.router.navigate(['/dashboard/facility/' + value]);
    this.pgMenuToggle = false;
    if(value == ''){
      // this.dashboardContentArea = false;
    } else if(value == 'employees'){}
  }

}
