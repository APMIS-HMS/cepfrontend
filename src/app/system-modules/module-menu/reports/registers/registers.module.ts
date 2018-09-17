import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistersRoutingModule } from './registers-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared-module/shared.module';
import { DailyAntenatalComponent } from './register-entries/daily-antenatal/daily-antenatal.component';
import { NewAntenatalEntryComponent } from './register-entries/daily-antenatal/new-antenatal-entry/new-antenatal-entry.component';
import { AntenatalPg1Component } from './register-entries/daily-antenatal/antenatal-pg1/antenatal-pg1.component';
import { AntenatalPg2Component } from './register-entries/daily-antenatal/antenatal-pg2/antenatal-pg2.component';
import { DailyOpdComponent } from './register-entries/daily-opd/daily-opd.component';
import { OpdPg1Component } from './register-entries/daily-opd/opd-pg1/opd-pg1.component';
import { OpdPg2Component } from './register-entries/daily-opd/opd-pg2/opd-pg2.component';
import { NewOpdEntryComponent } from './register-entries/daily-opd/new-opd-entry/new-opd-entry.component';
import { NewFprEntryComponent } from './register-entries/daily-fpr/new-fpr-entry/new-fpr-entry.component';
import { FprPg2Component } from './register-entries/daily-fpr/fpr-pg2/fpr-pg2.component';
import { FprPg1Component } from './register-entries/daily-fpr/fpr-pg1/fpr-pg1.component';
import { NewIrtsEntryComponent } from './register-entries/daily-irts/new-irts-entry/new-irts-entry.component';
import { IrtsPg1Component } from './register-entries/daily-irts/irts-pg1/irts-pg1.component';
import { IrtsPg2Component } from './register-entries/daily-irts/irts-pg2/irts-pg2.component';
import { DailyFprComponent } from './register-entries/daily-fpr/daily-fpr.component';
import { DailyIrtsComponent } from './register-entries/daily-irts/daily-irts.component';

@NgModule({
  imports: [
    CommonModule,
    RegistersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    DailyAntenatalComponent,
    NewAntenatalEntryComponent,
    AntenatalPg1Component,
    AntenatalPg2Component,
    DailyOpdComponent,
    OpdPg1Component,
    OpdPg2Component,
    NewOpdEntryComponent,
    NewFprEntryComponent,
    FprPg2Component,
    FprPg1Component,
    NewIrtsEntryComponent,
    IrtsPg1Component,
    IrtsPg2Component,
    DailyFprComponent,
    DailyIrtsComponent
  ]
})
export class RegistersModule { }
