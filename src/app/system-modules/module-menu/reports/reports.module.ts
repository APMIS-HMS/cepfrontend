import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { WardManagerReportComponent } from './ward-manager-report/ward-manager-report.component';
import { StoreManagerReportComponent } from './store-manager-report/store-manager-report.component';

@NgModule({
	imports: [ CommonModule, ReportsRoutingModule ],
	declarations: [ ReportsComponent ]
})
export class ReportsModule {}
