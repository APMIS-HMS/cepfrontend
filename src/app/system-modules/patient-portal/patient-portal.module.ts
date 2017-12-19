import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientPortalComponent } from './patient-portal.component';
import { patientPortalRoutes } from './patient-portal.routes'; 
// import { PatientManagerHomeComponent } from './patient-manager-home.component';
import { SharedModule } from '../../shared-module/shared.module';
import { PatientPortalHomeComponent } from './patient-portal-home.component';
import { SystemModuleComponent } from '../system-module.component';
import { LogOutConfirmModule } from '../../shared-common-modules/log-out-module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    patientPortalRoutes,
    LogOutConfirmModule
  ],
  declarations: [
    PatientPortalComponent,
    PatientPortalHomeComponent,
    SystemModuleComponent
  ]
})

export class PatientPortalModule { }
