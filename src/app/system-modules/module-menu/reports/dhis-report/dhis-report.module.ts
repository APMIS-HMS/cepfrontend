import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared-module/shared.module';
import { OnlyMaterialModule } from '../../../../shared-common-modules/only-material-module';
import { MaterialModule } from '../../../../shared-common-modules/material-module';
import { RegistersComponent } from './registers/registers.component';
import { NhmisSummaryComponent } from './nhmis-summary/nhmis-summary.component';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
		OnlyMaterialModule,
		SharedModule
    ],

    declarations:[
        RegistersComponent,
        NhmisSummaryComponent
    ],

})

export class DhisReportModule {}