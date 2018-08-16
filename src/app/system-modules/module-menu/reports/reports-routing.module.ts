import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NhmisSummaryComponent } from './nhmis-summary/nhmis-summary.component';
import { ReportsComponent } from './reports.component';

const routes: Routes = [{
  path: '', component: ReportsComponent, children: [
    { path: '', redirectTo: 'nhmis' },
    {
      path: 'register',
      loadChildren: './registers/registers.module#RegistersModule'
    },
    { path: 'nhmis', component: NhmisSummaryComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
