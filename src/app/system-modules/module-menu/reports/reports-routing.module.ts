import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';

const routes: Routes = [
  {
      path: '', component: ReportsComponent, children: [
        { path: '', redirectTo: 'report' },
        {
          path: 'report-dashboard', component: ReportDashboardComponent },
      ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
