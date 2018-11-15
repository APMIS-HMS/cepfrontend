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

  pageInView = 'Patient Registration Report';

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  pageInViewLoader(title) {
		this.pageInView = title;
  }

  back_dashboard() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
  }

  patientRegistration_analytics() {
		this._router.navigate(['/dashboard/reports/report-dashboard/patient-manager-report/patient-registration-analytics']);
	  }

}
