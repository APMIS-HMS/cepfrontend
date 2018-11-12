
import { ReportDashboardComponent } from './report-dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDashboardRoutingModule } from './report-dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared-module/shared.module';
import { OnlyMaterialModule } from '../../../../shared-common-modules/only-material-module';
import { MaterialModule } from '../../../../shared-common-modules/material-module';
import { DashboardLandingpageComponent } from './dashboard-landingpage/dashboard-landingpage.component';
<<<<<<< HEAD
import { ClinicManagementReportComponent } from '../clinic-management-report/clinic-management-report.component';
import { NhmisSummaryComponent } from '../dhis-report/nhmis-summary/nhmis-summary.component';
import { LaboratoryReportComponent } from './laboratory-report/laboratory-report.component';
=======
// import { ClinicManagementReportComponent } from './clinic-management-report/clinic-management-report.component';
import { DhisReportComponent } from './dhis-report/dhis-report.component';
import { ClinicReportModule } from './clinic-management-report/clinic-management-report.module';

>>>>>>> 647d3bb22dcea8e82457511fef5bedbe8a70948e

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
		ReportDashboardComponent,
		DashboardLandingpageComponent,
<<<<<<< HEAD
		DhisReportComponent,
		ClinicManagementReportComponent,
		NhmisSummaryComponent,
		LaboratoryReportComponent
=======
		DhisReportComponent
>>>>>>> 647d3bb22dcea8e82457511fef5bedbe8a70948e
	]
})
export class ReportDashboardModule {}
