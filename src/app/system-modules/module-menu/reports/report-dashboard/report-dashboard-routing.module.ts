import { DashboardLandingpageComponent } from './dashboard-landingpage/dashboard-landingpage.component';
import { Routes, RouterModule } from '@angular/router';
import { DhisReportComponent } from '../dhis-report/dhis-report.component';
import { ReportDashboardComponent } from './report-dashboard.component';
import { ClinicManagementReportComponent } from '../clinic-management-report/clinic-management-report.component';
import { LaboratoryReportComponent } from './laboratory-report/laboratory-report.component';


const REPORTS_DASHBOARD_ROUTE: Routes = [
	{
		path: '',
		component: ReportDashboardComponent,
		children: [
			{ path: '', redirectTo: 'report-landing-page' },
			{ path: 'report-landing-page', component: DashboardLandingpageComponent },
			{ path: 'dhis-report', component: DhisReportComponent },
			{ path: 'clinic-report', component: ClinicManagementReportComponent },
			{ path: 'laboratory-report', component: LaboratoryReportComponent }
		]
	}
];

export const ReportDashboardRoutingModule = RouterModule.forChild(REPORTS_DASHBOARD_ROUTE);
