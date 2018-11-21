import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApmisStoreRoutingModule } from './apmis-store-routing.module';
import { ApmisStoreLandingpageComponent } from './apmis-store-landingpage.component';
import { ApmisStoreHomeComponent } from './apmis-store-home/apmis-store-home.component';

@NgModule({
  imports: [
    CommonModule,
    ApmisStoreRoutingModule
  ],
  declarations: [ApmisStoreLandingpageComponent, ApmisStoreHomeComponent]
})
export class ApmisStoreModule { }
