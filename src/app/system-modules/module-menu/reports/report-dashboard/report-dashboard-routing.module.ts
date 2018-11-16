import { DashboardLandingpageComponent } from './dashboard-landingpage/dashboard-landingpage.component';
import { Routes, RouterModule } from '@angular/router';
import { ReportDashboardComponent } from './report-dashboard.component';
import { ClinicManagementReportComponent } from './clinic-management-report/clinic-management-report.component';
import { DhisReportComponent } from './dhis-report/dhis-report.component';
import { LaboratoryReportComponent } from './laboratory-report/laboratory-report.component';
import { PatientManagerReportComponent } from './patient-manager-report/patient-manager-report.component';
<<<<<<< HEAD
import { PatientRegistrationAnalyticsComponent } from './patient-manager-report/patient-registration-analytics/patient-registration-analytics.component';

=======
import { PharmacyReportComponent } from './pharmacy-report/pharmacy-report.component';
>>>>>>> 64abd973a7d6e6c28d7e4c043843445eca029b00

const REPORTS_DASHBOARD_ROUTE: Routes = [
	{
		path: '',
		component: ReportDashboardComponent,
		children: [
			{ path: '', redirectTo: 'report-landing-page' },
			{ path: 'report-landing-page', component: DashboardLandingpageComponent },
			{
				path: 'clinic-report',
				loadChildren: './clinic-management-report/clinic-management-report.module#ClinicReportModule'
			},
			// { path: 'clinic-report', component: ClinicManagementReportComponent },
			{
				path: 'dhisReport',
				loadChildren: './dhis-report/dhis-report.module#DhisReportModule'
			},
			{ path: 'labReport', component: LaboratoryReportComponent},
			
<<<<<<< HEAD
			{ path: 'patientReport', component: PatientManagerReportComponent },
			{ path: 'patient-registration-analytics', component: PatientRegistrationAnalyticsComponent }
=======
			{ path: 'patientReport', component: PatientManagerReportComponent},
			
			
			{ path: 'pharmacyReport', component: PharmacyReportComponent}
>>>>>>> 64abd973a7d6e6c28d7e4c043843445eca029b00

		]
	}
];

export const ReportDashboardRoutingModule = RouterModule.forChild(REPORTS_DASHBOARD_ROUTE);
