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
import { DragulaModule } from 'ng2-dragula';

import { NgPipesModule } from 'ngx-pipes';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NewTagComponent } from '../system-modules/module-menu/billing/services/new-tag/new-tag.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTagComponent } from '../system-modules/module-menu/add-tag/add-tag.component';
import { MomentModule } from 'angular2-moment';
import { Ng2PaginationModule } from 'ng2-pagination';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { AddVitalsComponent } from '../system-modules/module-menu/patient-manager/add-vitals/add-vitals.component';
import { GlobalDialogComponent } from './global-dialog/global-dialog.component';
import { SurveyComponent } from './form-generator/survey.component';
import { SurveyEditorComponent } from './form-generator/survey.editor.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { CheckoutPatientComponent } from './checkout-patient/checkout-patient.component';
import { ProductService, StoreService } from '../services/facility-manager/setup/index';
import { StoreCheckInComponent } from './store-check-in/store-check-in.component';
import { CreateWorkspaceComponent } from '../system-modules/module-menu/facility-page/create-workspace/create-workspace.component';
import { AppointmentComponent } from '../system-modules/module-menu/clinic/appointment/appointment.component';
// tslint:disable-next-line:max-line-length
import { AddPrescriptionComponent } from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/add-prescription/add-prescription.component';
import { BillPrescriptionComponent } from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/bill-prescription/bill-prescription.component';
import { SingUpAccountsSharedModule } from '../shared-common-modules/signup-accounts-shared-module';
import { MaterialModule } from '../shared-common-modules/material-module';
import { LabRequestsComponent } from '../system-modules/module-menu/lab/lab-requests/lab-requests.component';
import { RequestDetailComponent } from '../system-modules/module-menu/lab/lab-requests/request-detail/request-detail.component';
import {
    MdDatepickerModule, MdNativeDateModule, MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule,
    MdInputModule, MdOptionModule, MdSelectionList, MdSelectModule, MdRadioButton
} from '@angular/material';
//import { LabCheckInComponent } from './lab-check-in/lab-check-in.component';
// import { ApmisLookupMultiselectComponent } from './apmis-lookup-multiselect/apmis-lookup-multiselect.component';
@NgModule({
    declarations: [
        // NewTagComponent,
        // AddTagComponent,
        SurveyComponent,
        SurveyEditorComponent,
        ProductSearchComponent,
        CheckoutPatientComponent
        //LabCheckInComponent,
        // LabRequestsComponent, RequestDetailComponent
    ],
    exports: [
        LogoUpdateComponent,
        NgUploaderModule,
        NgPipesModule,
        // NewTagComponent,
        // AddTagComponent,
        MomentModule,
        Ng2PaginationModule,
        InfiniteScrollModule,
        SurveyComponent,
        SurveyEditorComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SingUpAccountsSharedModule,
        // DragulaModule,
        // LabRequestsComponent, RequestDetailComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgUploaderModule,
        NgPipesModule,
        MomentModule,
        Ng2PaginationModule,
        InfiniteScrollModule,
        ImageCropperModule,
        MaterialModule,
        // DragulaModule
    ],
    providers: [StoreService]
})
export class SharedModule { }



