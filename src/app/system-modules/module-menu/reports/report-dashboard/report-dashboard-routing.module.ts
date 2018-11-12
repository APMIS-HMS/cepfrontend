import { DashboardLandingpageComponent } from './dashboard-landingpage/dashboard-landingpage.component';
import { Routes, RouterModule } from '@angular/router';
import { ReportDashboardComponent } from './report-dashboard.component';
<<<<<<< HEAD
import { ClinicManagementReportComponent } from '../clinic-management-report/clinic-management-report.component';
import { LaboratoryReportComponent } from './laboratory-report/laboratory-report.component';
=======
import { ClinicManagementReportComponent } from './clinic-management-report/clinic-management-report.component';
import { DhisReportComponent } from './dhis-report/dhis-report.component';
>>>>>>> 647d3bb22dcea8e82457511fef5bedbe8a70948e


const REPORTS_DASHBOARD_ROUTE: Routes = [
	{
		path: '',
		component: ReportDashboardComponent,
		children: [
			{ path: '', redirectTo: 'report-landing-page' },
			{ path: 'report-landing-page', component: DashboardLandingpageComponent },
<<<<<<< HEAD
			{ path: 'dhis-report', component: DhisReportComponent },
			{ path: 'clinic-report', component: ClinicManagementReportComponent },
			{ path: 'laboratory-report', component: LaboratoryReportComponent }
=======
			{
				path: 'clinic-report',
				loadChildren: './clinic-management-report/clinic-management-report.module#ClinicReportModule'
			},
			// { path: 'clinic-report', component: ClinicManagementReportComponent },
			{ path: 'dhisReport', component: DhisReportComponent}
>>>>>>> 647d3bb22dcea8e82457511fef5bedbe8a70948e
		]
	}
];

export const ReportDashboardRoutingModule = RouterModule.forChild(REPORTS_DASHBOARD_ROUTE);
