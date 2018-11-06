import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { NhmisSummaryComponent } from './nhmis-summary/nhmis-summary.component';
import { ReportsComponent } from './reports.component';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';



@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule
  ],
  declarations: [
    NhmisSummaryComponent,
    ReportsComponent,
    ReportDashboardComponent
  ]
})
export class ReportsModule { }
