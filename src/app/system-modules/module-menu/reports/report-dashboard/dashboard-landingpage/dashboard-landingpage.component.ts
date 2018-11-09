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
		this._router.navigate([ '/dashboard/reports/report-dashboard/dhis-report' ]);
  }
  
  call_clinicManagementReport() {
		this._router.navigate([ '/dashboard/reports/report-dashboard/clinic-report' ]);
	}

	call_laboratoryReport() {
		this._router.navigate(['/dashboard/reports/report-dashboard/laboratory-report']).then(p => {
			console.log(p);
		}).catch(error => {console.log(error) });
	}
}
