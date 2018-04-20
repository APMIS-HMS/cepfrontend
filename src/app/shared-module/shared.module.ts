import { OnlyMaterialModule } from './../shared-common-modules/only-material-module';
import { SystemModuleComponent } from './../system-modules/system-module.component';
import { NgModule } from '@angular/core';
import { LogoutConfirmComponent } from '../system-modules/module-menu/logout-confirm/logout-confirm.component';
import { LogoUpdateComponent } from '../system-modules/module-menu/facility-page/logo-update/logo-update.component';
import { ImageCropperModule } from 'ng2-img-cropper';
import { CommonModule, } from '@angular/common';
import { NgUploaderModule } from 'ngx-uploader';
import { GlobalPatientLookupComponent } from './global-patient-lookup/global-patient-lookup.component';
import { VerifyTokenComponent } from '../facility-setup/verify-token/verify-token.component';
import { AddLogoComponent } from '../facility-setup/add-logo/add-logo.component';
// import { AddFacilityModuleComponent } from '../facility-setup/add-facility-module/add-facility-module.component';
import { FacilityInfoComponent } from '../facility-setup/facility-info/facility-info.component';
import { ContactInfoComponent } from '../facility-setup/contact-info/contact-info.component';
import { FacilitySetupComponent } from '../facility-setup/facility-setup.component';
import { DragulaModule } from 'ng2-dragula';

import { NgPipesModule } from 'ngx-pipes';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NewTagComponent } from '../system-modules/module-menu/billing/services/new-tag/new-tag.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTagComponent } from '../system-modules/module-menu/add-tag/add-tag.component';
// import { MomentModule } from 'angular2-moment';
import { Ng2PaginationModule } from 'ng2-pagination';
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
import { Angular4PaystackModule } from 'angular4-paystack';
import { Angular4FlutterwaveComponent } from './angular-4-flutterwave/angular-4-flutterwave.component';
import { WindowRef } from '../services/facility-manager/setup/winref.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import {
  TemplateMedicationComponent
} from '../system-modules/module-menu/forms-manager/treatement-template/template-medication/template-medication.component';
import {
  TemplateLabComponent
} from '../system-modules/module-menu/forms-manager/treatement-template/template-lab/template-lab.component';
import {
  TemplateProcedureComponent
} from '../system-modules/module-menu/forms-manager/treatement-template/template-procedure/template-procedure.component';
import {
  TemplateNursingCareComponent
} from '../system-modules/module-menu/forms-manager/treatement-template/template-nursing-care/template-nursing-care.component';
import {
  TemplatePhysicianOrderComponent
} from '../system-modules/module-menu/forms-manager/treatement-template/template-physician-order/template-physician-order.component';
import { OrderSetSharedService } from '../services/facility-manager/order-set-shared-service';
import { SharedModuleMaterialModule } from '../shared-common-modules/sharedmodule-materialsmodule';
import { PaymentChartComponent } from './payment-chart/payment-chart.component';
@NgModule({
  declarations: [
    SurveyComponent,
    SurveyEditorComponent,
    ProductSearchComponent,
    Angular4FlutterwaveComponent,
    TemplateMedicationComponent,
    TemplateLabComponent,
    TemplateProcedureComponent,
    TemplateNursingCareComponent,
    TemplatePhysicianOrderComponent,
    PaymentChartComponent  ],
  exports: [
    NgUploaderModule,
    NgPipesModule,
    Ng2PaginationModule,
    SurveyComponent,
    SurveyEditorComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SingUpAccountsSharedModule,
    Angular4FlutterwaveComponent,
    Angular4PaystackModule,
    TemplateMedicationComponent,
    TemplateLabComponent,
    TemplateProcedureComponent,
    TemplateNursingCareComponent,
    TemplatePhysicianOrderComponent,
    SharedModuleMaterialModule
  ],
  imports: [ 
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgUploaderModule,
    NgPipesModule,
    Ng2PaginationModule,
    ImageCropperModule,
    OnlyMaterialModule,
    MaterialModule,
    SharedModuleMaterialModule
  ],
  providers: [StoreService, WindowRef, OrderSetSharedService, SystemModuleService]
})
export class SharedModule {}



