import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacilitySetupComponent } from '../facility-setup/facility-setup.component';
import { PersonAccountComponent } from '../person-account/person-account.component';
import { CorporateSignupComponent } from '../corporate-signup/corporate-signup.component';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';

import { ContactInfoComponent } from '../facility-setup/contact-info/contact-info.component';
import { AddLogoComponent } from '../facility-setup/add-logo/add-logo.component';
import { FacilityInfoComponent } from '../facility-setup/facility-info/facility-info.component';
import { VerifyTokenComponent } from '../facility-setup/verify-token/verify-token.component';
import { DxDateBoxComponent } from 'devextreme-angular';
import { AddFacilityModuleComponent } from '../facility-setup/add-facility-module/add-facility-module.component';
import { Routing } from './signup-routes';
import { SignupHomeComponent } from './signup-home.component';
import { SingUpAccountsSharedModule } from '../shared-common-modules/signup-accounts-shared-module';
import { MaterialModule } from '../shared-common-modules/material-module';

@NgModule({
    declarations: [
        SignupComponent,
        FacilitySetupComponent,
        PersonAccountComponent,
        CorporateSignupComponent,
        SignupHomeComponent
    ],
    exports: [
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        Routing,
        SingUpAccountsSharedModule,
         MaterialModule
    ],
    providers: [
    ]
})
export class SingUpModule { }



