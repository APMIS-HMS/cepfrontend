import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistersRoutingModule } from './registers-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared-module/shared.module';
import { DailyAntenatalComponent } from './register-entries/daily-antenatal/daily-antenatal.component';
import { NewAntenatalEntryComponent } from './register-entries/daily-antenatal/new-antenatal-entry/new-antenatal-entry.component';

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
  NewAntenatalEntryComponent]
})
export class RegistersModule { }
