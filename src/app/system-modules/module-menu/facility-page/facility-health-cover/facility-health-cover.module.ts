import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacilityHealthCoverComponent } from './facility-health-cover.component';
import { OnlyMaterialModule } from '../../../../shared-common-modules/only-material-module';
import { HmoOfficerComponent } from '../hmo-officer/hmo-officer.component';
import { HmoBillDetailComponent } from '../hmo-officer/hmo-bill-detail/hmo-bill-detail.component';
import { HmoBillHistoryDetailComponent } from '../hmo-officer/hmo-bill-history-detail/hmo-bill-history-detail.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { MaterialModule } from '../../../../shared-common-modules/material-module';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

@NgModule({
  imports: [
    CommonModule,
    OnlyMaterialModule,
    SweetAlert2Module,
    MaterialModule,   
    Ng4GeoautocompleteModule 
  ],
  declarations: [
    FacilityHealthCoverComponent,
    HmoOfficerComponent,
    HmoBillDetailComponent, 
    HmoBillHistoryDetailComponent
  ]
})
export class FacilityHealthCoverModule { }
