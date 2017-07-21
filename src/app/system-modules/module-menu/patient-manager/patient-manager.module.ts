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
import { DocumentationDetailComponent } from './patientmanager-detailpage/documentation/documentation-detail/documentation-detail.component';
import { ClinicalNoteComponent } from './patientmanager-detailpage/documentation/clinical-note/clinical-note.component';
import { AddPatientProblemComponent } from './patientmanager-detailpage/documentation/add-patient-problem/add-patient-problem.component';
import { AddAllergyComponent } from './patientmanager-detailpage/documentation/add-allergy/add-allergy.component';
//import { BillPrescriptionComponent } from './patientmanager-detailpage/bill-prescription/bill-prescription.component';
//import { AddPrescriptionComponent } from './patientmanager-detailpage/add-prescription/add-prescription.component';

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
        AddAllergyComponent
        //BillPrescriptionComponent,
        //AddPrescriptionComponent
    ],
    exports: [
    ],
    imports: [
        // SharedModule,
        // CommonModule,
        // ReactiveFormsModule,
        // FormsModule,
        // DatePickerModule,
        patientManagerRoutes,
        MaterialModule
    ],
    providers: [PatientResolverService, AppointmentResolverService, LoginEmployeeResolverService, FormsService]
})
export class PatientManagerModule { }



