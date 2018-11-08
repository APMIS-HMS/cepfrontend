import { DhisReportComponent } from './../dhis-report/dhis-report.component';
import { ReportDashboardComponent } from './report-dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDashboardRoutingModule } from './report-dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared-module/shared.module';
import { OnlyMaterialModule } from '../../../../shared-common-modules/only-material-module';
import { MaterialModule } from '../../../../shared-common-modules/material-module';
import { DashboardLandingpageComponent } from './dashboard-landingpage/dashboard-landingpage.component';
import { ClinicManagementReportComponent } from '../clinic-management-report/clinic-management-report.component';
import { NhmisSummaryComponent } from '../dhis-report/nhmis-summary/nhmis-summary.component';

@NgModule({
	imports: [
		CommonModule,
		ReportDashboardRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		OnlyMaterialModule,
		SharedModule
	],
	declarations: [
		// RegistersComponent,
		ReportDashboardComponent,
		DashboardLandingpageComponent,
		DhisReportComponent,
		ClinicManagementReportComponent,
		NhmisSummaryComponent
	]
})
export class ReportDashboardModule {}
