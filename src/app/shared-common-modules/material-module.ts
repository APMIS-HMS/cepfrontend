import { NgModule } from '@angular/core';
import {
    MdDatepickerModule, MdNativeDateModule, MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule, MdErrorDirective,
    MdInputModule, MdAutocompleteModule, MdOptionModule, MdTabsModule, MdListModule, MdSelectionModule, MdSelectModule, MdRadioModule
}
    from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, } from '@angular/common';
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
import { SimdilizedLookupComponent } from '../shared-module/simdilized-lookup/simdilized-lookup.component';
import { StoreCheckInComponent } from '../shared-module/store-check-in/store-check-in.component';
import { MomentModule } from 'angular2-moment';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { CoolStorageModule } from 'angular2-cool-storage';
import { ToastyModule } from 'ng2-toasty';
import { InvestigationComponent } from '../system-modules/module-menu/laboratory/new-request/investigation/investigation.component';
import { OrderStatusService, SeverityService } from '../services/module-manager/setup/index';
import {KeysPipe } from './keypipe';

@NgModule({
    declarations: [CreateWorkspaceComponent, GlobalDialogComponent,
        LogoUpdateComponent,
        AddVitalsComponent,
        AddPrescriptionComponent,
        BillPrescriptionComponent,
        PatientPrescriptionComponent,
        GlobalPatientLookupComponent,
        StoreCheckInComponent,
        ImageUpdateComponent,
        SimdilizedLookupComponent,
        InvestigationComponent,
        KeysPipe
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
        MdSelectionModule,
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
        MomentModule,
        ToastModule,
        CoolStorageModule,
        MdErrorDirective,
        ToastyModule,
        SimdilizedLookupComponent,
        InvestigationComponent,
        KeysPipe
        // SurveyComponent, SurveyEditorComponent
    ],
    imports: [
        MdNativeDateModule,
        MdDatepickerModule,
        MdButtonModule,
        MdRadioModule,
        MdCheckboxModule,
        MdProgressSpinnerModule,
        MdInputModule,
        MdAutocompleteModule,
        MdOptionModule,
        MdSelectionModule,
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
        ToastyModule.forRoot()
    ],
    providers: [OrderStatusService, SeverityService]
})
export class MaterialModule { }



