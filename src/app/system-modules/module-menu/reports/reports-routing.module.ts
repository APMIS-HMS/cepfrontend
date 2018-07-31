import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NhmisSummaryComponent } from './nhmis-summary/nhmis-summary.component';

const routes: Routes = [
  {
    path: "",
    component: NhmisSummaryComponent
  }, 
  {
    path: "nhmis-summary",
    component: NhmisSummaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
