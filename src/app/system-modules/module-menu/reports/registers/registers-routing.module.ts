import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewRegisterComponent } from './new-register/new-register.component';
import { RegisterEntriesComponent } from './register-entries/register-entries.component';
import { RegisterEntryComponent } from './register-entries/register-entry/register-entry.component';
import { RegistersComponent } from './registers.component';

const routes: Routes = [
  { path: '', redirectTo: 'list' },
  { path: 'list', component: RegistersComponent },
  { path: 'register-entries', component: RegisterEntriesComponent },
  { path: 'entry-detail', component: RegisterEntryComponent },
  { path: 'new-entry', component: NewRegisterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistersRoutingModule { }
