import { RouterModule } from '@angular/router';
import { LogoutConfirmComponent } from './module-menu/logout-confirm/logout-confirm.component';
import { MaterialModule } from 'app/shared-common-modules/material-module';
import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { systemModulesRoutes } from './system-module.routes';
import { SystemModuleComponent } from './system-module.component';
import { SharedModule } from '../shared-module/shared.module';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { LogOutConfirmModule } from '../shared-common-modules/log-out-module';
import { ChangePasswordComponent } from './module-menu/change-password/change-password.component';

@NgModule({
  declarations: [
    // SystemModuleComponent,
    LogoutConfirmComponent
  ],
  exports: [
  ],
  imports: [
    // CommonModule,
    // ReactiveFormsModule,
    // FormsModule 
    ChangePasswordComponent,
    LogOutConfirmModule,
    systemModulesRoutes,
    SharedModule,
    LoadingBarHttpModule,
    RouterModule

  ],
  providers: []
})
export class SystemModule { }



