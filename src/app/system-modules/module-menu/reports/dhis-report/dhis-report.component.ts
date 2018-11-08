import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dhis-report',
  templateUrl: './dhis-report.component.html',
  styleUrls: ['./dhis-report.component.scss']
})
export class DhisReportComponent implements OnInit {

  nhmis = false;
  register = false;

  constructor(private _router: Router) { }

  ngOnInit() {
    const page: string = this._router.url;
    this.checkPageUrl(page);
  }

  
  checkPageUrl(param: string) {
    if (param.includes('nhis-summary')) {
      this.nhmis = true;
      this.register = false;
      this._router.navigate(['/dashboard/reports/nhis-summary']);
    } else if (param.includes('registers')) {
      this.nhmis = false;
      this.register = true; 
      this._router.navigate(['/dashboard/reports/register']);
    } else {
      this.nhmis = true;
      this.register = false; 
      this._router.navigate(['/dashboard/reports/nhis-summary']);
    }
  }

  route(link){
    if(link === 'nhis-summary'){
      this.nhmis = true;
      this.register = false;
    } else if(link === 'register'){
      this.nhmis = false;
      this.register = true;
    } else{
      this.nhmis = true;
      this.register = false;
    }
    this._router.navigate(['/dashboard/reports/report-dashboard' + link]);
  }

}
