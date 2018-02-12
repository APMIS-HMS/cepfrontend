import { SystemModuleComponent } from './../system-module.component';
import { homePageRoutes } from './home-page.routes';
import { MaterialModule } from './../../shared-common-modules/material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { HomePageComponent } from './home-page.component';
import { HomePageHomeComponent } from './home-page-home.component';
import { PersonLandingComponent } from './person-landing/person-landing.component';
import { PersonScheduleAppointmentComponent } from './person-landing/person-schedule-appointment/person-schedule-appointment.component';
import { BiodataPopupComponent } from './biodata-popup/biodata-popup.component';
import { MedRecordsComponent } from './med-records/med-records.component';
import { MedRecordHomeComponent } from './med-records/med-record-home/med-record-home.component';
import { MedRecordDocumentationComponent } from './med-records/med-record-documentation/med-record-documentation.component';
import { MedRecordPrescriptionComponent } from './med-records/med-record-prescription/med-record-prescription.component';
import { MedRecordDiagnosticsComponent } from './med-records/med-record-diagnostics/med-record-diagnostics.component';
import { MedRecordPaymentComponent } from './med-records/med-record-payment/med-record-payment.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    homePageRoutes,
    ChartsModule
  ],
  declarations: [
    HomePageComponent,
    HomePageHomeComponent,
    PersonLandingComponent,
    PersonScheduleAppointmentComponent,
    BiodataPopupComponent,
    MedRecordsComponent,
    MedRecordHomeComponent,
    MedRecordDocumentationComponent,
    MedRecordPrescriptionComponent,
    MedRecordDiagnosticsComponent,
    MedRecordPaymentComponent,
  ]
})
export class HomePageModule { }
