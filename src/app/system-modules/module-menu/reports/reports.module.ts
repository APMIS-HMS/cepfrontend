import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { OnlyMaterialModule } from '../../../shared-common-modules/only-material-module';

import { ReportsRoutingModule } from './reports-routing.module';
import { NhmisSummaryComponent } from './report-dashboard/dhis-report/nhmis-summary/nhmis-summary.component';
import { RegistersComponent } from "./report-dashboard/dhis-report/registers/registers.component";
import { ReportsComponent } from './reports.component';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { DhisReportComponent } from './report-dashboard/dhis-report/dhis-report.component';
import { DhisReportComponent } from './dhis-report/dhis-report.component';
import { ClinicManagementReportComponent } from './clinic-management-report/clinic-management-report.component';
import { ClinicAttendanceComponent } from './clinic-management-report/clinic-attendance/clinic-attendance.component';
import { ClinicVisitComponent } from './clinic-management-report/clinic-visit/clinic-visit.component';



@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    OnlyMaterialModule,
    ReportsRoutingModule
  ],
  declarations: [
    NhmisSummaryComponent,
    ReportsComponent,
    ReportDashboardComponent,
    DhisReportComponent,
    RegistersComponent,
    ReportDashboardComponent,
    ReportDashboardComponent,
    DhisReportComponent,
    ClinicManagementReportComponent,
    ClinicAttendanceComponent,
    ClinicVisitComponent
  ]
})
export class ReportsModule { }
