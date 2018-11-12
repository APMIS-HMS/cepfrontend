import { DashboardLandingpageComponent } from './dashboard-landingpage/dashboard-landingpage.component';
import { Routes, RouterModule } from '@angular/router';
import { ReportDashboardComponent } from './report-dashboard.component';
import { ClinicManagementReportComponent } from './clinic-management-report/clinic-management-report.component';
import { DhisReportComponent } from './dhis-report/dhis-report.component';
import { LaboratoryReportComponent } from './laboratory-report/laboratory-report.component';
import { PatientManagerReportComponent } from './patient-manager-report/patient-manager-report.component';


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
			{ path: 'dhisReport', component: DhisReportComponent},
			{ path: 'labReport', component: LaboratoryReportComponent},
			
			{ path: 'patientReport', component: PatientManagerReportComponent}

		]
	}
];

export const ReportDashboardRoutingModule = RouterModule.forChild(REPORTS_DASHBOARD_ROUTE);
