import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  pgMenuToggle = false;
  basicData_popup = false;
  tab1 = true;
  tab2 = false;

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
  tab1_click(){
    this.tab1 = true;
    this.tab2 = false;
  }
  tab2_click(){
    this.tab1 = false;
    this.tab2 = true;
  }
  basicData_show(){
    this.basicData_popup = true;
  }
  close_onClick(){
    this.basicData_popup = false;
  }

}
