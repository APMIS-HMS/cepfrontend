import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { NewRegisterComponent } from './new-register/new-register.component';
import { RegisterEntriesComponent } from './register-entries/register-entries.component';
import { RegisterEntryComponent } from './register-entries/register-entry/register-entry.component';
import { RegistersComponent } from './registers.component';
import { DailyAntenatalComponent } from './register-entries/daily-antenatal/daily-antenatal.component';
import { DailyOpdComponent } from './register-entries/daily-opd/daily-opd.component';
import { DailyIrtsComponent } from './register-entries/daily-irts/daily-irts.component';
import { DailyFprComponent } from './register-entries/daily-fpr/daily-fpr.component';
import { DailyGmpComponent } from './register-entries/daily-gmp/daily-gmp.component';
import { DailyLdrComponent } from './register-entries/daily-ldr/daily-ldr.component';

const routes: Routes = [
  { path: '', redirectTo: 'list' },
  { path: 'list', component: RegistersComponent },
  { path: 'register-entries', component: RegisterEntriesComponent },
  { path: 'entry-detail', component: RegisterEntryComponent },
  // { path: 'new-entry', component: NewRegisterComponent },
  { path: 'antenatal', component: DailyAntenatalComponent },
  { path: 'opd', component: DailyOpdComponent },
  { path: 'irts', component: DailyIrtsComponent },
  { path: 'fpr', component: DailyFprComponent },

  { path: 'gmp', component: DailyGmpComponent },
  { path: 'ldr', component: DailyLdrComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistersRoutingModule { }
