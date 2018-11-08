import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportDashboardComponent } from "./report-dashboard.component";
import { RegisterEntriesComponent } from "./../registers/register-entries/register-entries.component";
import { DhisReportComponent } from "./../dhis-report/dhis-report.component";


const routes: Routes = [
    { path:'', redirectTo: 'reportDashboard'},
    { path: 'reportDashboard', component: ReportDashboardComponent },    
    { path: 'register-entries', component: RegisterEntriesComponent },
    { path: 'dhis-report', component: DhisReportComponent }
];



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ReportDashboardRoutingModule { }