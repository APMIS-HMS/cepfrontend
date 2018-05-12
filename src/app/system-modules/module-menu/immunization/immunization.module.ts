import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImmunizationComponent } from './immunization.component';
import { immunizationRoutes } from './immunization.routes';
import { OnlyMaterialModule } from '../../../shared-common-modules/only-material-module';

@NgModule({
  imports: [
        OnlyMaterialModule,
        CommonModule,immunizationRoutes
  ],
  declarations: [ImmunizationComponent]
})
export class ImmunizationModule { }
