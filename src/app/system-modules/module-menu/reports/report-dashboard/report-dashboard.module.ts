import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared-module/shared.module';
import { OnlyMaterialModule } from '../../../../shared-common-modules/only-material-module';
import { MaterialModule } from '../../../../shared-common-modules/material-module';
import { RegistersComponent } from "./dhis-report/registers/registers.component";
import { DhisReportComponent } from "./dhis-report/dhis-report.component";
import { reportDashboardRoutes } from './report-dashboard.routes';


@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        OnlyMaterialModule,
        SharedModule,
        reportDashboardRoutes
    ],
    exports: [
    ],
    declarations:[
        RegistersComponent,
        DhisReportComponent
    ]
})
export class  ReportDashboardModule { }