import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientManagerReportComponent } from './patient-manager-report.component';
import { PatientRegistrationAnalyticsComponent } from './patient-registration-analytics/patient-registration-analytics.component';

const PATIENT_MANAGER_REPORT_ROUTE: Routes = [
{
  path: '',
  component: PatientManagerReportComponent,
  children: [
    // { path: '', redirectTo: 'clinic-report-page' },
    // { path: 'clinic-report-page', component: ClinicManagementReportComponent },
    { path: 'patient-registration-analytics', component: PatientRegistrationAnalyticsComponent },
  ]
}
];

export const PatientManagerReportRoutingModule = RouterModule.forChild(PATIENT_MANAGER_REPORT_ROUTE);
