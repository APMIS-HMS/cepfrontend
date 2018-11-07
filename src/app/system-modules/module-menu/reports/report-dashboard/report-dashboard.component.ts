import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-dashboard',
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.scss', './../reports.component.scss']
})
export class ReportDashboardComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit() {
  }

<<<<<<< HEAD
  call_dhisReport() {
    this._router.navigate(['/dashboard/reports/register/dhis-report']);
=======
  call_register() {
    this._router.navigate(['/dashboard/reports/register/register-entries']);
>>>>>>> 1edb8da990294d2a920849fb780b07eb577c6153
  }
}
