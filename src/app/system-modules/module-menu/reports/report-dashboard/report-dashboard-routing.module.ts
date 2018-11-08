import { DashboardLandingpageComponent } from './dashboard-landingpage/dashboard-landingpage.component';
import { Routes, RouterModule } from '@angular/router';
import { DhisReportComponent } from '../dhis-report/dhis-report.component';
import { ReportDashboardComponent } from './report-dashboard.component';

const REPORTS_DASHBOARD_ROUTE: Routes = [
	{
		path: '',
		component: ReportDashboardComponent,
		children: [
			{ path: '', redirectTo: 'report-landing-page' },
			{ path: 'report-landing-page', component: DashboardLandingpageComponent },
			{ path: 'dhis-report', component: DhisReportComponent }
		]
	}
];

export const ReportDashboardRoutingModule = RouterModule.forChild(REPORTS_DASHBOARD_ROUTE);
