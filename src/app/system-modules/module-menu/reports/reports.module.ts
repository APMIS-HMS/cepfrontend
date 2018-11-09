import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { NhmisSummaryComponent } from './nhmis-summary/nhmis-summary.component';
import { ReportsComponent } from './reports.component';
import { VisitsComponent } from './visits/visits.component';
import { ClinicAttendanceComponent } from './clinic-attendance/clinic-attendance.component';



@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule
  ],
  declarations: [
    NhmisSummaryComponent,
    ReportsComponent,
    VisitsComponent,
    ClinicAttendanceComponent
  ]
})
export class ReportsModule { }
