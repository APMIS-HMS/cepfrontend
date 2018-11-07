import { Routes, RouterModule } from '@angular/router';
import { ReportDashboardComponent } from "./report-dashboard.component";
import { DhisReportComponent } from "./dhis-report/dhis-report.component";

const REPORTDASHBOARD_ROUTES: Routes = [
  {
    path: '', component: ReportDashboardComponent, children: [
      { path: '', redirectTo: 'report-dashboard' },

      {
         path: 'dhis-report', 
         loadChildren: './dhis-report/dhis-report.module#dhisReportModule'
      }
    ]
  }];

  export const reportDashboardRoutes = RouterModule.forChild(REPORTDASHBOARD_ROUTES);