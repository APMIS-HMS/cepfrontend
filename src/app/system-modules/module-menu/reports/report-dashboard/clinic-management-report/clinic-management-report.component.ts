import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-clinic-management-report',
	templateUrl: './clinic-management-report.component.html',
	styleUrls: [ './clinic-management-report.component.scss' ]
})
export class ClinicManagementReportComponent implements OnInit {
	clinicAttendance = false;
	diagnosis = false;

	constructor(private _router: Router) {}

	ngOnInit() {
		const page: string = this._router.url;
		this.checkPageUrl(page);
	}

	checkPageUrl(param: string) {
		if (param.includes('clinic-attendance')) {
			this.clinicAttendance = true;
			this.diagnosis = false;
			this._router.navigate([ '/dashboard/reports/report-dashboard/clinic-report/clinic-attendance' ]);
		} else if (param.includes('diagnosis')) {
			this.clinicAttendance = false;
			this.diagnosis = true;
			this._router.navigate([ '/dashboard/reports/report-dashboard/clinic-report/diagnosis' ]);
		} else {
			this.clinicAttendance = true;
			this.diagnosis = false;
			this._router.navigate([ '/dashboard/reports/report-dashboard/clinic-report/clinic-attendance' ]);
		}
	}

	route(link) {
		console.log(link);
		if (link === 'clinic-attendance') {
			this.clinicAttendance = true;
			this.diagnosis = false;
		} else if (link === 'diagnosis') {
			this.clinicAttendance = false;
			this.diagnosis = true;
		} else {
			this.clinicAttendance = true;
			this.diagnosis = false;
		}
		this._router.navigate([ '/dashboard/reports/report-dashboard/clinic-report/' + link ]);
	}
}
