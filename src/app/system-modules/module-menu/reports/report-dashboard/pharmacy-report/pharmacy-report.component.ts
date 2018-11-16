import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-pharmacy-report',
  templateUrl: './pharmacy-report.component.html',
  styleUrls: ['./pharmacy-report.component.scss']
})
export class PharmacyReportComponent implements OnInit {

  searchControl = new FormControl();
  searchCriteria = new FormControl('Search');

  prescriberFilter = false;
  prescriberSearch = false;
  dispenseFilter = false;

  pageInView = 'Pharmacy Report';

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  pageInViewLoader(title) {
		this.pageInView = title;
  }
  
  back_dashboard() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
	  }

onclick_prescribe(){
  this.prescriberFilter = true;
  this.dispenseFilter = false;
}

onclick_dispense(){
  this.prescriberFilter = false;
  this.dispenseFilter = true;
}

}
