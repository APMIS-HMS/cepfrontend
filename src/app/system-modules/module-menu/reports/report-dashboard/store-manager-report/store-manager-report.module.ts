import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared-common-modules/material-module';
import { OnlyMaterialModule } from 'app/shared-common-modules/only-material-module';
import { SharedModule } from 'app/shared-module/shared.module';
import { StoreManagerReportComponent } from './store-manager-report.component';
import { StoreManagerReportRoutingModule } from './store-manager-report-routing.module';

@NgModule({
  imports: [
    CommonModule,
    StoreManagerReportRoutingModule,
    MaterialModule,
		OnlyMaterialModule,
    SharedModule
  ],
  declarations: [
    StoreManagerReportComponent ]
})
export class StoreManagerReportModule { }
