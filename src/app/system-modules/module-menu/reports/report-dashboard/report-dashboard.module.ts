import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDashboardRoutingModule }  from './report-dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared-module/shared.module';
import { OnlyMaterialModule } from '../../../../shared-common-modules/only-material-module';
import { MaterialModule } from '../../../../shared-common-modules/material-module';
import { RegistersComponent } from "./../registers/registers.component";


@NgModule({
    imports:[
        CommonModule,
        ReportDashboardRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        OnlyMaterialModule,
        SharedModule
    ],
    declarations:[
        RegistersComponent
    ]
})
export class  ReportDashboardModule { }