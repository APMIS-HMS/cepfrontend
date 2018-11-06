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

  call_register() {
    this._router.navigate(['/dashboard/reports/register/register-entries']);
  }
}
