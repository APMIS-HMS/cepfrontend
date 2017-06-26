import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { moduleMenuRoutes } from './module-menu.routes';
import { ModuleMenuComponent } from './module-menu.component';
import { SharedModule } from '../../shared-module/shared.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ClinicalDocumentationComponent } from './clinical-documentation/clinical-documentation.component';
import { DashboardComponent } from './dashboard/dashboard.component';




@NgModule({
    declarations: [
        ModuleMenuComponent,
        ChangePasswordComponent,
        ClinicalDocumentationComponent,
        DashboardComponent
    ],
exports: [
    ],
    imports: [
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        moduleMenuRoutes,
    ],
    providers: [
    ]
})
export class ModuleMenu { }



