import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
=======
import { ReportDashboardRoutingModule }  from './report-dashboard-routing.module';
>>>>>>> 1edb8da990294d2a920849fb780b07eb577c6153
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared-module/shared.module';
import { OnlyMaterialModule } from '../../../../shared-common-modules/only-material-module';
import { MaterialModule } from '../../../../shared-common-modules/material-module';
<<<<<<< HEAD
import { RegistersComponent } from "./dhis-report/registers/registers.component";
import { DhisReportComponent } from "./dhis-report/dhis-report.component";
import { reportDashboardRoutes } from './report-dashboard.routes';
=======
import { RegistersComponent } from "./../registers/registers.component";
>>>>>>> 1edb8da990294d2a920849fb780b07eb577c6153


@NgModule({
    imports:[
        CommonModule,
<<<<<<< HEAD
=======
        ReportDashboardRoutingModule,
>>>>>>> 1edb8da990294d2a920849fb780b07eb577c6153
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        OnlyMaterialModule,
<<<<<<< HEAD
        SharedModule,
        reportDashboardRoutes
    ],
    exports: [
    ],
    declarations:[
        RegistersComponent,
        DhisReportComponent
=======
        SharedModule
    ],
    declarations:[
        RegistersComponent
>>>>>>> 1edb8da990294d2a920849fb780b07eb577c6153
    ]
})
export class  ReportDashboardModule { }