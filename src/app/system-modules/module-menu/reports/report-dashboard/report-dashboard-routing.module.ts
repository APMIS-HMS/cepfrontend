import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportDashboardComponent } from "./report-dashboard.component";
import { RegisterEntriesComponent } from "./../registers/register-entries/register-entries.component";


const routes: Routes = [
    { path:'', redirectTo: 'report'},
    {path: '', component: ReportDashboardComponent },    
    { path: 'register-entries', component: RegisterEntriesComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ReportDashboardRoutingModule { }