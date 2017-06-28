import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home.component';
import { Routing } from './dashboard-routes';
import { LogOutConfirmModule } from '../../shared-common-modules/log-out-module';
import {SingUpAccountsSharedModule } from '../../shared-common-modules/signup-accounts-shared-module'
import {SharedModule } from '../../shared-module/shared.module';
import { ChangePasswordComponent } from '../../system-modules/module-menu/change-password/change-password.component';
import { SystemModuleComponent } from '../system-module.component';
@NgModule({
    declarations: [
        DashboardComponent,
        DashboardHomeComponent,
        ChangePasswordComponent,
        SystemModuleComponent
    ],
    exports: [
    ],
    imports: [
        LogOutConfirmModule,
        SharedModule,
        Routing
    ],
    providers: [
    ]
})
export class DashboardModule { }



