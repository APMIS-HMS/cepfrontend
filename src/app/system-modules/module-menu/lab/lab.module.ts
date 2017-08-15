import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { SharedModule } from '../../../shared-module/shared.module';
import { labRoutes } from './lab.routes';
import { LabComponent } from './lab.component';
import { WorkbenchComponent } from './workbench/workbench.component';
import { InvestigationServiceComponent } from './investigation-service/investigation-service.component';
import { InvestigationPriceComponent } from './investigation-price/investigation-price.component';
import { PanelComponent } from './panel/panel.component';
import { WorkbenchService, LaboratoryRequestService } from '../../../services/facility-manager/setup/index';
import { ReportComponent } from './report/report.component';

@NgModule({
  imports: [
    // CommonModule,
    labRoutes,
    // SharedModule,
    MaterialModule
  ],
  declarations: [LabComponent, WorkbenchComponent, InvestigationServiceComponent, InvestigationPriceComponent, PanelComponent, ReportComponent],
  providers:[WorkbenchService, LaboratoryRequestService]
})
export class LabModule { }
