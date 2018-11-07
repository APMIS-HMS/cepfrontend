import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhmisSummaryComponent } from './nhmis-summary/nhmis-summary.component';
import { RegistersComponent } from './registers/registers.component';


@NgModule({
    imports: [
      CommonModule
    ],
    declarations: [
      NhmisSummaryComponent,
      RegistersComponent
    ]
  })
  export class dhisReportModule { }