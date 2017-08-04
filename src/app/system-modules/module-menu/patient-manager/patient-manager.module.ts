import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'ng2-datepicker';
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
import { PatientLaboratoryComponent } from './patientmanager-detailpage/patient-laboratory/patient-laboratory.component';
import {InvestigationComponent} from '../laboratory/new-request/investigation/investigation.component';
import { TimelineComponent } from './patientmanager-detailpage/timeline/timeline.component';
import { RightTabComponent } from './patientmanager-detailpage/documentation/right-tab/right-tab.component'
import { ChartsModule } from 'ng2-charts';

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
        // PatientPrescriptionComponent,
        MedicationHistoryComponent,
        UpdateImgComponent,
        ExternalPrescriptionComponent,
        DocumentationComponent,
        DocumentationDetailComponent,
        ClinicalNoteComponent,
        AddPatientProblemComponent,
        AddAllergyComponent,
        AddHistoryComponent,
        PatientLaboratoryComponent,
        TimelineComponent,
        RightTabComponent,
        // InvestigationComponent
        // InvestigationComponent
        // SurveyComponent,
        // SurveyEditorComponent
        // BillPrescriptionComponent,
        // AddPrescriptionComponent
    ],
    exports: [
    ],
    imports: [
        SharedModule,
        // CommonModule,
        // ReactiveFormsModule,
        // FormsModule,
        // DatePickerModule,
        patientManagerRoutes,
        MaterialModule,
        ChartsModule
    ],
    providers: [PatientResolverService, AppointmentResolverService, LoginEmployeeResolverService,
        FormsService, FormTypeService, SharedService]
})
export class PatientManagerModule { }



