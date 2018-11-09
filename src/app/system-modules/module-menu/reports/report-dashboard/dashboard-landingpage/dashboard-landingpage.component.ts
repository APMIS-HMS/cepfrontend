import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-dashboard-landingpage',
	templateUrl: './dashboard-landingpage.component.html',
	styleUrls: [ './dashboard-landingpage.component.scss' ]
})
export class DashboardLandingpageComponent implements OnInit {
	constructor(private _router: Router) {}

	ngOnInit() {}

	call_dhisReport() {
		this._router.navigate([ '/dashboard/reports/report-dashboard/dhisReport' ]);
  }
  
  call_clinicManagementReport() {
		this._router.navigate([ '/dashboard/reports/report-dashboard/clinicReport' ]);
	}

	call_diagnosis() {
		this._router.navigate([ '/dashboard/reports/report-dashboard/diagnosis' ]);
	}
}
