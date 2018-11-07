import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { OnlyMaterialModule } from '../../../shared-common-modules/only-material-module';

import { ReportsRoutingModule } from './reports-routing.module';
import { NhmisSummaryComponent } from './report-dashboard/dhis-report/nhmis-summary/nhmis-summary.component';
import { RegistersComponent } from "./report-dashboard/dhis-report/registers/registers.component";
import { ReportsComponent } from './reports.component';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
<<<<<<< HEAD
import { DhisReportComponent } from './report-dashboard/dhis-report/dhis-report.component';
=======
>>>>>>> 1edb8da990294d2a920849fb780b07eb577c6153



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
<<<<<<< HEAD
    ReportDashboardComponent,
    DhisReportComponent,
    RegistersComponent
=======
    ReportDashboardComponent
>>>>>>> 1edb8da990294d2a920849fb780b07eb577c6153
  ]
})
export class ReportsModule { }
