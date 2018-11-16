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
		this._router.navigate([ '/dashboard/reports/report-dashboard/clinic-report' ]);
	}
	call_patientReport() {
		console.log('this is Patient Manager report');
		this._router.navigate([ '/dashboard/reports/report-dashboard/patientManagerReport' ]);
	}
	call_laboratoryReport() {
		this._router.navigate(['/dashboard/reports/report-dashboard/labReport']);
	}
	call_pharmacyReport() {
		this._router.navigate(['/dashboard/reports/report-dashboard/pharmacyReport']);
	}
}
