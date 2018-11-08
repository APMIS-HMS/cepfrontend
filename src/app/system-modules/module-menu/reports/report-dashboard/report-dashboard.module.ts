import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDashboardRoutingModule }  from './report-dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared-module/shared.module';
import { OnlyMaterialModule } from '../../../../shared-common-modules/only-material-module';
import { MaterialModule } from '../../../../shared-common-modules/material-module';
import { RegistersComponent } from "./../registers/registers.component";
import { LaboratoryReportComponent } from './laboratory-report/laboratory-report.component';
import { PatientManagerReportComponent } from './patient-manager-report/patient-manager-report.component';


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
        RegistersComponent,
        LaboratoryReportComponent,
        PatientManagerReportComponent
    ]
})
export class  ReportDashboardModule { }