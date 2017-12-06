import { NgModule } from '@angular/core';
import {
    MdDatepickerModule, MdNativeDateModule, MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule, MdError, MdDatepickerToggle,
    MdInputModule, MdAutocompleteModule, MdOptionModule, MdTabsModule, MdListModule, MdSelectBase, MdSelectModule, MdRadioModule, MdPaginatorModule
}
    from '@angular/material';
// import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateWorkspaceComponent } from '../system-modules/module-menu/facility-page/create-workspace/create-workspace.component';
import { GlobalDialogComponent } from '../shared-module/global-dialog/global-dialog.component';
import { LogoUpdateComponent } from '../system-modules/module-menu/facility-page/logo-update/logo-update.component';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ImageUpdateComponent } from '../system-modules/module-menu/employee-manager/image-update/image-update.component';
import { NgUploaderModule } from 'ngx-uploader';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { AddVitalsComponent } from '../system-modules/module-menu/patient-manager/add-vitals/add-vitals.component';
// tslint:disable-next-line:max-line-length
import { AddPrescriptionComponent } from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/add-prescription/add-prescription.component';
import { BillPrescriptionComponent } from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/bill-prescription/bill-prescription.component';
// tslint:disable-next-line:max-line-length
import { PatientPrescriptionComponent } from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/patient-prescription/patient-prescription.component';
import { GlobalPatientLookupComponent } from '../shared-module/global-patient-lookup/global-patient-lookup.component';
import { ApmisLookupComponent } from '../shared-module/apmis-lookup/apmis-lookup.component';
import { ApmisLookupMultiselectComponent } from '../shared-module/apmis-lookup-multiselect/apmis-lookup-multiselect.component';
import { StoreCheckInComponent } from '../shared-module/store-check-in/store-check-in.component';
import { LabCheckInComponent } from '../shared-module/lab-check-in/lab-check-in.component';
import { MomentModule } from 'angular2-moment';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { CoolStorageModule } from 'angular2-cool-storage';
import { ToastyModule } from 'ng2-toasty';
import { OrderStatusService, SeverityService } from '../services/module-manager/setup/index';
import { KeysPipe } from './keypipe';
import { PersonAccountComponent } from '../person-account/person-account.component';

import { LabRequestsComponent } from '../system-modules/module-menu/lab/lab-requests/lab-requests.component';
import { RequestDetailComponent } from '../system-modules/module-menu/lab/lab-requests/request-detail/request-detail.component';
import { DragulaModule } from 'ng2-dragula';
import { NgPipesModule } from 'ngx-pipes';
import { CheckoutPatientComponent } from 'app/shared-module/checkout-patient/checkout-patient.component';
@NgModule({
    declarations: [CreateWorkspaceComponent, GlobalDialogComponent,
        LogoUpdateComponent,
        AddVitalsComponent,
        AddPrescriptionComponent,
        BillPrescriptionComponent,
        PatientPrescriptionComponent,
        GlobalPatientLookupComponent,
        StoreCheckInComponent,
        LabCheckInComponent,
        ImageUpdateComponent,
        ApmisLookupComponent, ApmisLookupMultiselectComponent,
        KeysPipe,
        // MdDatepickerToggle,
        PersonAccountComponent,
        LabRequestsComponent, RequestDetailComponent,
        CheckoutPatientComponent
        //  SurveyComponent, SurveyEditorComponent
    ],
    exports: [
        MdNativeDateModule,
        MdDatepickerModule,
        MdButtonModule,
        MdCheckboxModule,
        MdProgressSpinnerModule,
        MdInputModule,
        MdAutocompleteModule,
        MdOptionModule,
        MdDatepickerToggle,
        MdPaginatorModule,
        // MdSelectBase,
        MdSelectModule,
        MdRadioModule,
        MdListModule,
        MdTabsModule,
        NgbModule,



        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        CreateWorkspaceComponent,
        GlobalDialogComponent,
        LogoUpdateComponent,
        ImageCropperModule,
        ImageUpdateComponent,
        NgUploaderModule,
        AddVitalsComponent,
        AddPrescriptionComponent,
        BillPrescriptionComponent,
        PatientPrescriptionComponent,
        CurrencyMaskModule,
        GlobalPatientLookupComponent,
        StoreCheckInComponent,
        LabCheckInComponent,
        MomentModule,
        ToastModule,
        CoolStorageModule,
        MdError,
        ToastyModule,
        ApmisLookupComponent, ApmisLookupMultiselectComponent,
        KeysPipe,
        PersonAccountComponent,
        LabRequestsComponent, RequestDetailComponent,
        DragulaModule,
        NgPipesModule,
        CheckoutPatientComponent

        // SurveyComponent, SurveyEditorComponent
    ],
    imports: [
        // BrowserModule,
        MdNativeDateModule,
        MdDatepickerModule,
        MdButtonModule,
        MdRadioModule,
        MdCheckboxModule,
        MdProgressSpinnerModule,
        MdInputModule,
        MdAutocompleteModule,
        MdOptionModule,
        MdPaginatorModule,
        // MdSelectBase,
        MdSelectModule,
        MdListModule,
        MdRadioModule,
        MdTabsModule,
        NgbModule.forRoot(),
        ToastModule.forRoot(),
        CoolStorageModule,
        MomentModule,


        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ImageCropperModule,
        NgUploaderModule,
        CurrencyMaskModule,
        ToastyModule.forRoot(),
        DragulaModule,
        NgPipesModule
    ],
    providers: [OrderStatusService, SeverityService]
})
export class MaterialModule { }



