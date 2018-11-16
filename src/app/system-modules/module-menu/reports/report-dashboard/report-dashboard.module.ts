import { ReportDashboardComponent } from './report-dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDashboardRoutingModule } from './report-dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared-module/shared.module';
import { OnlyMaterialModule } from '../../../../shared-common-modules/only-material-module';
import { MaterialModule } from '../../../../shared-common-modules/material-module';
import { DashboardLandingpageComponent } from './dashboard-landingpage/dashboard-landingpage.component';
import { DhisReportComponent } from './dhis-report/dhis-report.component';
import { ClinicReportModule } from './clinic-management-report/clinic-management-report.module';
import { PatientManagerReportComponent } from './patient-manager-report/patient-manager-report.component';
import { LaboratoryReportComponent } from './laboratory-report/laboratory-report.component';
<<<<<<< HEAD
import { PatientRegistrationAnalyticsComponent } from './patient-manager-report/patient-registration-analytics/patient-registration-analytics.component';
=======
import { PharmacyReportComponent } from './pharmacy-report/pharmacy-report.component';
>>>>>>> 64abd973a7d6e6c28d7e4c043843445eca029b00

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
		PatientManagerReportComponent,
		LaboratoryReportComponent,
<<<<<<< HEAD
		PatientRegistrationAnalyticsComponent
=======
		PharmacyReportComponent
>>>>>>> 64abd973a7d6e6c28d7e4c043843445eca029b00
	]
})
export class ReportDashboardModule {}
