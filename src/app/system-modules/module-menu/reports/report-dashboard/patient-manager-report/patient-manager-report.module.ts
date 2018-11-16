import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared-module/shared.module';
import { MaterialModule } from 'app/shared-common-modules/material-module';
import { OnlyMaterialModule } from 'app/shared-common-modules/only-material-module';
import { PatientManagerReportRoutingModule } from './patient-manager-report-routing.module';
import { PatientManagerReportComponent } from './patient-manager-report.component';
import { PatientRegistrationAnalyticsComponent } from './patient-registration-analytics/patient-registration-analytics.component';

@NgModule({
  imports: [
    MaterialModule,
		OnlyMaterialModule,
		SharedModule,
    CommonModule,
    PatientManagerReportRoutingModule
  ],
  declarations: [
    PatientRegistrationAnalyticsComponent,
    PatientManagerReportComponent ]
})
export class PatientManagerReportModule { }
