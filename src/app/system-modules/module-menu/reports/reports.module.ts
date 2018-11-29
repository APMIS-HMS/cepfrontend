import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import {
	WardMan
	agerReportComponent
} from './report-dashboard/ward-manager-report/ward-manager-report.component';
import { StoreManagerReportComponent } from './report-dashboard/store-manager-report/store-manager-report.component';

@NgModule({
	imports: [ CommonModule, ReportsRoutingModule ],
	declarations: [ ReportsComponent, WardManagerReportComponent ]
})
export class ReportsModule {}
