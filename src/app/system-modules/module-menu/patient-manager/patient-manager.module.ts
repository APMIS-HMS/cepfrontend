import { HmoService } from './../../../services/facility-manager/setup/hmo.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientManagerComponent } from './patient-manager.component';
import { patientManagerRoutes } from './patient-manager.routes';
import { PatientManagerHomeComponent } from './patient-manager-home.component';
import { PatientmanagerHomepageComponent } from './patientmanager-homepage/patientmanager-homepage.component';
import { PatientmanagerDetailpageComponent } from './patientmanager-detailpage/patientmanager-detailpage.component';
import { NewPatientComponent } from './new-patient/new-patient.component';
import { SharedModule } from '../../../shared-module/shared.module';
import { PatientResolverService, AppointmentResolverService, LoginEmployeeResolverService } from '../../../resolvers/module-menu/index';
import { CheckoutPatientComponent } from './checkout-patient/checkout-patient.component';
import { AddTagsComponent } from './add-tags/add-tags.component';
import { FormsService } from '../../../services/facility-manager/setup/index';
import { PatientSummaryComponent } from './patientmanager-detailpage/patient-summary/patient-summary.component';
import { PatientPrescriptionComponent } from './patientmanager-detailpage/patient-prescription/patient-prescription.component';
import { MedicationHistoryComponent } from './patientmanager-detailpage/medication-history/medication-history.component';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { UpdateImgComponent } from './update-img/update-img.component';
import { ExternalPrescriptionComponent } from './patientmanager-detailpage/external-prescription/external-prescription.component';
import { DocumentationComponent } from './patientmanager-detailpage/documentation/documentation.component';
// tslint:disable-next-line:max-line-length
import { DocumentationDetailComponent } from './patientmanager-detailpage/documentation/documentation-detail/documentation-detail.component';
import { ClinicalNoteComponent } from './patientmanager-detailpage/documentation/clinical-note/clinical-note.component';
import { AddPatientProblemComponent } from './patientmanager-detailpage/documentation/add-patient-problem/add-patient-problem.component';
import { AddAllergyComponent } from './patientmanager-detailpage/documentation/add-allergy/add-allergy.component';
import { AddHistoryComponent } from './patientmanager-detailpage/documentation/add-history/add-history.component';
import { FormTypeService } from '../../../services/module-manager/setup/index';
import { SurveyComponent } from '../../../shared-module/form-generator/survey.component';
import { SurveyEditorComponent } from '../../../shared-module/form-generator/survey.editor.component';
import { SharedService } from '../../../shared-module/shared.service';
import { TimelineComponent } from './patientmanager-detailpage/timeline/timeline.component';
import { RightTabComponent } from './patientmanager-detailpage/documentation/right-tab/right-tab.component'
import { ChartsModule } from 'ng2-charts';
import { WorkbenchService, LaboratoryRequestService } from '../../../services/facility-manager/setup/index';
import { PaymentComponent } from './patientmanager-detailpage/payment/payment.component';
import { WalletComponent } from './patientmanager-detailpage/payment/wallet/wallet.component';
import { InsuranceComponent } from './patientmanager-detailpage/payment/insurance/insurance.component';
import { CompanyComponent } from './patientmanager-detailpage/payment/company/company.component';
import { FamilyComponent } from './patientmanager-detailpage/payment/family/family.component';
import { PatientPaymentPlanComponent } from './patient-payment-plan/patient-payment-plan.component';
@NgModule({
    declarations: [
        PatientManagerComponent,
        PatientManagerHomeComponent,
        PatientmanagerHomepageComponent,
        PatientmanagerDetailpageComponent,
        NewPatientComponent,
        CheckoutPatientComponent,
        AddTagsComponent,
        PatientSummaryComponent,
        MedicationHistoryComponent,
        UpdateImgComponent,
        ExternalPrescriptionComponent,
        DocumentationComponent,
        DocumentationDetailComponent,
        ClinicalNoteComponent,
        AddPatientProblemComponent,
        AddAllergyComponent,
        AddHistoryComponent,
        TimelineComponent,
        RightTabComponent,
        PaymentComponent,
        WalletComponent,
        InsuranceComponent,
        CompanyComponent,
        FamilyComponent,
        PatientPaymentPlanComponent
    ],
    exports: [
    ],
    imports: [
        SharedModule,
        patientManagerRoutes,
        MaterialModule,
        ChartsModule
    ],
    providers: [PatientResolverService, AppointmentResolverService, LoginEmployeeResolverService,
        FormsService, FormTypeService, SharedService, WorkbenchService, LaboratoryRequestService, HmoService]
})
export class PatientManagerModule { }



