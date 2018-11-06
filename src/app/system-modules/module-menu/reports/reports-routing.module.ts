import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NhmisSummaryComponent } from './nhmis-summary/nhmis-summary.component';
import { ReportsComponent } from './reports.component';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';

const routes: Routes = [{
  path: '', component: ReportsComponent, children: [
    { path: '', redirectTo: 'report' },
    {
      path: 'report-dashboard',
      loadChildren: './report-dashboard/report-dashboard.module#RegistersModule'
      // loadChildren: './registers/registers.module#RegistersModule'
    },
    { path: 'report', component: ReportDashboardComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
