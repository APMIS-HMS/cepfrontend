import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-registration-report',
  templateUrl: './patient-registration-report.component.html',
  styleUrls: ['./patient-registration-report.component.scss']
})
export class PatientRegistrationReportComponent implements OnInit {

  searchControl = new FormControl();
  searchCriteria = new FormControl('Search');
  checked = false;

  pageInView = 'Patient Registration Analytics';

  constructor(private _router: Router) { }

  ngOnInit() {

  }


}
