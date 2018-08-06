import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistersRoutingModule } from './registers-routing.module';
import { RegistersComponent } from './registers.component';
import { NewRegisterComponent } from './new-register/new-register.component';
import { RegisterEntriesComponent } from './register-entries/register-entries.component';
import { RegisterEntryComponent } from './register-entries/register-entry/register-entry.component';
import { NewRegisterEntryComponent } from './register-entries/new-register-entry/new-register-entry.component';
import { RegEntriesListComponent } from './register-entries/reg-entries-list/reg-entries-list.component';

@NgModule({
  imports: [
    CommonModule,
    RegistersRoutingModule
  ],
  declarations: [
    RegistersComponent,
    NewRegisterComponent,
    RegisterEntriesComponent,
    RegisterEntryComponent,
    NewRegisterEntryComponent,
    RegEntriesListComponent
  ]
})
export class RegistersModule { }
