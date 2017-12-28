import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupApmisid } from './signup-apmisid/signup-apmisid.component';
// import { VerifyTokenComponent } from './verify-token/verify-token.component';
// import { AddLogoComponent } from './add-logo/add-logo.component';
// import { AddFacilityModuleComponent } from './add-facility-module/add-facility-module.component';
import { SharedModule } from '../shared-module/shared.module';

@NgModule({
  declarations: [
    // FacilitySetupComponent,
    // VerifyTokenComponent,
    // AddLogoComponent,
    // AddFacilityModuleComponent
    SignupApmisid
  ],

  exports: [
    // FacilitySetupComponent,
    // VerifyTokenComponent,
    // AddLogoComponent,
    // AddFacilityModuleComponent
    SignupApmisid
  ],
  imports: [
    // CommonModule,
    // ReactiveFormsModule,
    // FormsModule,
    SharedModule 
  ],
  providers: []
})
export class FacilitySetupModule { }
