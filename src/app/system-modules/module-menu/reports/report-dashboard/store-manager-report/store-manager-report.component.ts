import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-store-manager-report',
  templateUrl: './store-manager-report.component.html',
  styleUrls: ['./store-manager-report.component.scss']
})
export class StoreManagerReportComponent implements OnInit {

  pageInView = 'Store Report';

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  pageInViewLoader(title) {
		this.pageInView = title;
  }

  back_dashboard() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
	  }

}
