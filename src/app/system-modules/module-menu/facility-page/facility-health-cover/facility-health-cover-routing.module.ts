import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HmoOfficerComponent } from '../hmo-officer/hmo-officer.component';

const routes: Routes = [
  { path: "", component: HmoOfficerComponent },
  { path: "hmo", component: HmoOfficerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilityHealthCoverRoutingModule { }
