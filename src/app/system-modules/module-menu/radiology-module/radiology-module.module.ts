import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { OnlyMaterialModule } from '../../../shared-common-modules/only-material-module';
import { RadiologyModuleRoutingModule } from './radiology-module-routing.module';
import { RadiologyModuleComponent } from './radiology-module.component';
import { RmNewRequestComponent } from './rm-request/rm-new-request/rm-new-request.component';
import { RmRequestComponent } from './rm-request/rm-request.component';
import { RmRequestListComponent } from './rm-request/rm-request-list/rm-request-list.component';

@NgModule({
  imports: [
    CommonModule,
    RadiologyModuleRoutingModule,
    MaterialModule, OnlyMaterialModule
  ],
  declarations: [RadiologyModuleComponent, RmNewRequestComponent, RmRequestComponent, RmRequestListComponent]
})
export class RadiologyModuleModule { }
