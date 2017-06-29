import { NgModule } from '@angular/core';
import { LogoutConfirmComponent } from '../system-modules/module-menu/logout-confirm/logout-confirm.component';
import { LogoUpdateComponent } from '../system-modules/module-menu/facility-page/logo-update/logo-update.component';
import { ImageCropperModule } from 'ng2-img-cropper';
import { CommonModule, } from '@angular/common';
import { ImageUpdateComponent } from '../system-modules/module-menu/employee-manager/image-update/image-update.component';
import { NgUploaderModule } from 'ngx-uploader';
import { GlobalPatientLookupComponent } from './global-patient-lookup/global-patient-lookup.component';
import { VerifyTokenComponent } from '../facility-setup/verify-token/verify-token.component';
import { AddLogoComponent } from '../facility-setup/add-logo/add-logo.component';
import { AddFacilityModuleComponent } from '../facility-setup/add-facility-module/add-facility-module.component';
import { FacilityInfoComponent } from '../facility-setup/facility-info/facility-info.component';
import { ContactInfoComponent } from '../facility-setup/contact-info/contact-info.component';
import { FacilitySetupComponent } from '../facility-setup/facility-setup.component';

import { NgPipesModule } from 'ngx-pipes';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NewTagComponent } from '../system-modules/module-menu/billing/services/new-tag/new-tag.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTagComponent } from '../system-modules/module-menu/add-tag/add-tag.component';
import { DevExtremeModule, DxLoadIndicatorModule, DxLookupModule, DxDateBoxModule, DxSparklineModule } from 'devextreme-angular';
// import 'devextreme-intl';
import { MomentModule } from 'angular2-moment';
import { Ng2PaginationModule } from 'ng2-pagination';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { NotificationComponent } from './notification/notification.component';
import { AddVitalsComponent } from '../system-modules/module-menu/patient-manager/add-vitals/add-vitals.component';
import { GlobalDialogComponent } from './global-dialog/global-dialog.component';
import { SurveyComponent } from './form-generator/survey.component';
import { SurveyEditorComponent } from './form-generator/survey.editor.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { ProductService, StoreService } from '../services/facility-manager/setup/index';
import { StoreCheckInComponent } from './store-check-in/store-check-in.component';
import { CreateWorkspaceComponent } from '../system-modules/module-menu/facility-page/create-workspace/create-workspace.component';
import { AppointmentComponent } from '../system-modules/module-menu/clinic/appointment/appointment.component';
// tslint:disable-next-line:max-line-length
import { AddPrescriptionComponent } from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/add-prescription/add-prescription.component';
import {SingUpAccountsSharedModule } from '../shared-common-modules/signup-accounts-shared-module';
@NgModule({
    declarations: [
        // AppointmentComponent,
        // LogoutConfirmComponent,
        AddPrescriptionComponent,

        LogoUpdateComponent,
        ImageUpdateComponent,
        GlobalPatientLookupComponent,
        NewTagComponent,
        AddTagComponent,
        NotificationComponent,
        AddVitalsComponent,
        GlobalDialogComponent,
        SurveyComponent,
        SurveyEditorComponent,
        ProductSearchComponent,
        StoreCheckInComponent,
        // VerifyTokenComponent,
        // AddLogoComponent,
        // AddFacilityModuleComponent,
        // FacilitySetupComponent,
        // ContactInfoComponent,
        // FacilityInfoComponent,
        CreateWorkspaceComponent
    ],
    exports: [
        // AppointmentComponent,
        // LogoutConfirmComponent,

        AddPrescriptionComponent,
        LogoUpdateComponent,
        ImageUpdateComponent,
        ImageCropperModule,
        NgUploaderModule,
        NgPipesModule,
        CurrencyMaskModule,
        GlobalPatientLookupComponent,
        NewTagComponent,
        AddTagComponent,
        DevExtremeModule,
        DxLookupModule,
        DxDateBoxModule,
        DxSparklineModule,
        DxLoadIndicatorModule,
        MomentModule,
        Ng2PaginationModule,
        InfiniteScrollModule,
        NotificationComponent,
        AddVitalsComponent,
        GlobalDialogComponent,
        SurveyComponent,
        SurveyEditorComponent,
        StoreCheckInComponent,
        // VerifyTokenComponent,
        // AddLogoComponent,
        // AddFacilityModuleComponent,
        // FacilitySetupComponent,
        // ContactInfoComponent,
        // FacilityInfoComponent,
        CreateWorkspaceComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SingUpAccountsSharedModule
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgUploaderModule,
        NgPipesModule,
        CurrencyMaskModule,
        DevExtremeModule,
        DxLoadIndicatorModule,
        DxLookupModule,
        DxDateBoxModule,
        DxSparklineModule,
        MomentModule,
        Ng2PaginationModule,
        InfiniteScrollModule,
        ImageCropperModule
    ],
    providers: [StoreService]
})
export class SharedModule { }



