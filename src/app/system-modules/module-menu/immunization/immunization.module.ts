import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { ImmunizationComponent } from './immunization.component';
import { immunizationRoutes } from './immunization.routes';
import { SharedModule } from '../../../shared-module/shared.module';
import { OnlyMaterialModule } from '../../../shared-common-modules/only-material-module';
import { ImmunizationScheduleComponent } from './immunization-schedule/immunization-schedule.component';
import { ImmunizationScheduleService } from '../../../services/facility-manager/setup/immunization-schedule.service';

@NgModule({
  imports: [
    MaterialModule,
        OnlyMaterialModule,
        CommonModule,immunizationRoutes
  ],
  declarations: [ImmunizationComponent, ImmunizationScheduleComponent],
  providers: [ImmunizationScheduleService]
})
export class ImmunizationModule { }
