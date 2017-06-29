import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyTokenComponent } from '../facility-setup/verify-token/verify-token.component';
import { AddLogoComponent } from '../facility-setup/add-logo/add-logo.component';
import { FacilityInfoComponent } from '../facility-setup/facility-info/facility-info.component';
import { ContactInfoComponent } from '../facility-setup/contact-info/contact-info.component';
import { AddFacilityModuleComponent } from '../facility-setup/add-facility-module/add-facility-module.component';
import { SharedModuleSignUpAccountModule } from './sharedmodule-signupaccountsmodule'
import { DxDateBoxModule } from 'devextreme-angular';
import { LoginComponent } from '../login/login.component';
import { MdDatepickerModule, MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule } from '@angular/material';
@NgModule({
    declarations: [
        VerifyTokenComponent,
        AddLogoComponent,
        ContactInfoComponent,
        FacilityInfoComponent,
        AddFacilityModuleComponent,
        LoginComponent,
        // DxDateBoxComponent
    ],
    exports: [
        VerifyTokenComponent,
        AddLogoComponent,
        ContactInfoComponent,
        FacilityInfoComponent,
        AddFacilityModuleComponent,
        // DxDateBoxComponent,
        DxDateBoxModule,
        CommonModule,
        SharedModuleSignUpAccountModule,
        LoginComponent,
        MdDatepickerModule,
        MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        DxDateBoxModule,
        SharedModuleSignUpAccountModule,
         MdDatepickerModule,
        MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule,
    ],
    providers: []
})
export class SingUpAccountsSharedModule { }



