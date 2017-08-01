import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { SharedModule } from '../../../shared-module/shared.module';
import { labRoutes } from './lab.routes';
import { LabRequestsComponent } from './lab-requests/lab-requests.component';
import {LabComponent } from './lab.component';
import { WorkbenchComponent } from './workbench/workbench.component';

@NgModule({
  imports: [
    CommonModule,
    labRoutes,
    SharedModule,
    MaterialModule
  ],
  declarations: [LabRequestsComponent, LabComponent, WorkbenchComponent]
})
export class LabModule { }
