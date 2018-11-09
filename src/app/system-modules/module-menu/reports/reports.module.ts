import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { VisitsComponent } from './visits/visits.component';
import { ClinicAttendanceComponent } from './clinic-attendance/clinic-attendance.component';

@NgModule({
<<<<<<< HEAD
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
=======
	imports: [ CommonModule, ReportsRoutingModule ],
	declarations: [ ReportsComponent ]
>>>>>>> 55c05e3e26301403ee2a4382ebe29dfdbe31f4d6
})
export class ReportsModule {}
