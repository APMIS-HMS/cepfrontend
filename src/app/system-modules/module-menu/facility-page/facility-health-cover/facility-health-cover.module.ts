import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityHealthCoverRoutingModule } from './facility-health-cover-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacilityHealthCoverComponent } from './facility-health-cover.component';
import { OnlyMaterialModule } from '../../../../shared-common-modules/only-material-module';
import { HmoOfficerComponent } from '../hmo-officer/hmo-officer.component';
import { HmoBillDetailComponent } from '../hmo-officer/hmo-bill-detail/hmo-bill-detail.component';
import { HmoBillHistoryDetailComponent } from '../hmo-officer/hmo-bill-history-detail/hmo-bill-history-detail.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { MaterialModule } from '../../../../shared-common-modules/material-module';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { FacilityCompanyCoverComponent } from './facility-company-cover/facility-company-cover.component';
import { FacilityFamilyCoverComponent } from './facility-family-cover/facility-family-cover.component';

@NgModule({
  imports: [
    CommonModule,
    FacilityHealthCoverRoutingModule, 
    OnlyMaterialModule,
    SweetAlert2Module,
    MaterialModule,   
    Ng4GeoautocompleteModule 
  ],
  declarations: [
    FacilityHealthCoverComponent,
    HmoOfficerComponent,
    HmoBillDetailComponent, 
    HmoBillHistoryDetailComponent, FacilityCompanyCoverComponent, FacilityFamilyCoverComponent
  ]
})
export class FacilityHealthCoverModule { }
