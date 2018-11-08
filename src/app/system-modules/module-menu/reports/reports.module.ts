import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { NhmisSummaryComponent } from './nhmis-summary/nhmis-summary.component';
import { ReportsComponent } from './reports.component';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { DhisReportComponent } from './dhis-report/dhis-report.component';
import { ClinicManagementReportComponent } from './clinic-management-report/clinic-management-report.component';
import { ClinicAttendanceComponent } from './clinic-management-report/clinic-attendance/clinic-attendance.component';
import { ClinicVisitComponent } from './clinic-management-report/clinic-visit/clinic-visit.component';



@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule
  ],
  declarations: [
    NhmisSummaryComponent,
    ReportsComponent,
    ReportDashboardComponent,
    DhisReportComponent,
    ClinicManagementReportComponent,
    ClinicAttendanceComponent,
    ClinicVisitComponent
  ]
})
export class ReportsModule { }
