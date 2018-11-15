import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-registration-analytics',
  templateUrl: './patient-registration-analytics.component.html',
  styleUrls: ['./patient-registration-analytics.component.scss']
})
export class PatientRegistrationAnalyticsComponent implements OnInit {

  pageInView = 'Patient Registration Analytics';

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  pageInViewLoader(title) {
		this.pageInView = title;
  }
  patientRegistration_analytics() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
	  }

}
