import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { NhmisSummaryComponent } from './nhmis-summary/nhmis-summary.component';
import { ReportsComponent } from './reports.component';
import {CoreUiModules} from "../../../core-ui-modules/CoreUiModules";



@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
      CoreUiModules
  ],
  declarations: [
    NhmisSummaryComponent,
    ReportsComponent
  ]
})
export class ReportsModule { }
