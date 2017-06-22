import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { systemModulesRoutes } from './system-module.routes';
import { SystemModuleComponent } from './system-module.component';
import { SharedModule } from '../shared-module/shared.module';

@NgModule({
  declarations: [
    SystemModuleComponent,
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    systemModulesRoutes,
    SharedModule

  ],
  providers: []
})
export class SystemModule { }



