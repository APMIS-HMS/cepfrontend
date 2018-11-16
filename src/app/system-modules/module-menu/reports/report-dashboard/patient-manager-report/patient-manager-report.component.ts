import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-patient-manager-report',
  templateUrl: './patient-manager-report.component.html',
  styleUrls: ['./patient-manager-report.component.scss']
})
export class PatientManagerReportComponent implements OnInit {

  searchControl = new FormControl();
  searchCriteria = new FormControl('Search');
  patientRegistrationAnalytics = false;

  pageInView = 'Patient Registration Report';

  constructor(private _router: Router) { }

  ngOnInit() {
    const page: string = this._router.url;
		this.checkPageUrl(page);
  }

  checkPageUrl(param: string) {
		if (param.includes('patient-registration-analytics')) {
			this.patientRegistrationAnalytics = true;
      this._router.navigate(['/dashboard/reports/patient-manager-report/patient-registration-analytics']);
		} else {
			this.patientRegistrationAnalytics = false;
			//this._router.navigate([ '/dashboard/reports/report-dashboard/patient-manager-report' ]);
		}
  }

	route(link) {
		console.log(link);
		if (link === 'patient-registration-analytics') {
			this.patientRegistrationAnalytics = true;
		}  else {
			this.patientRegistrationAnalytics = false;
		}
		this._router.navigate([ '/dashboard/reports/report-dashboard/patient-manager-report' + link ]);
	}

  pageInViewLoader(title) {
		this.pageInView = title;
  }

  back_dashboard() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
  }

 // patientRegistration_analytics() {
	//	this._router.navigate(['/dashboard/reports/report-dashboard/patient-manager-report/patient-registration-analytics']);
	 // }

}
