import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';

<<<<<<< HEAD
const routes: Routes = [
  {
      path: '', component: ReportsComponent, children: [
        { path: '', redirectTo: 'report' },
        {
          path: 'report-dashboard', component: ReportDashboardComponent },
      ]
=======
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
>>>>>>> 1edb8da990294d2a920849fb780b07eb577c6153
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
