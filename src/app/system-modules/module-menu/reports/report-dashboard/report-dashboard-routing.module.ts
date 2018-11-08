import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportDashboardComponent } from "./report-dashboard.component";
import { RegisterEntriesComponent } from "./../registers/register-entries/register-entries.component";
import { DhisReportComponent } from "./../dhis-report/dhis-report.component";
import { LaboratoryReportComponent } from './laboratory-report/laboratory-report.component';
import { PatientManagerReportComponent } from './patient-manager-report/patient-manager-report.component';

const routes: Routes = [
    // { path:'', redirectTo: 'report'},
    {path: '', component: ReportDashboardComponent },    
    { path: 'register-entries', component: RegisterEntriesComponent },
    { path: 'dhis-report', component: DhisReportComponent },
    { path: 'laboratory-report', component: LaboratoryReportComponent },
    { path: 'patient-report', component: PatientManagerReportComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ReportDashboardRoutingModule { }