import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HmoOfficerComponent } from '../hmo-officer/hmo-officer.component';
import { FacilityHealthCoverComponent } from './facility-health-cover.component';
import { FacilityCompanyCoverComponent } from './facility-company-cover/facility-company-cover.component';
import { FacilityFamilyCoverComponent } from './facility-family-cover/facility-family-cover.component';

const routes: Routes = [
  {
    path: '', component: FacilityHealthCoverComponent, children: [
      { path: "", redirectTo: 'hmo', pathMatch: 'full' },
      { path: "hmo", component: HmoOfficerComponent },
      { path: "family-cover", component: FacilityFamilyCoverComponent },
      { path: "company-cover", component: FacilityCompanyCoverComponent }
    ]
  },
  // { path: "", component: HmoOfficerComponent },
  // { path: "hmo", component: HmoOfficerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilityHealthCoverRoutingModule { }
