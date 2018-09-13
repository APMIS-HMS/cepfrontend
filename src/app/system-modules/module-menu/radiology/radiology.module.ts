import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadiologyComponent } from './radiology.component';
import { radiologyRoutes } from './radiology.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { SharedModule } from '../../../shared-module/shared.module';
import { RadiologyInvestigationPriceComponent } from './radiology-investigation-price/radiology-investigation-price.component';
import { PanelComponent } from './panel/panel.component';
import { WorkbenchService, LaboratoryRequestService } from '../../../services/facility-manager/setup/index';
import { ReportComponent } from './report/report.component';
import { ReportDetailComponent } from './report/report-detail/report-detail.component';
import { ExternalInvestigationsComponent } from './external-investigations/external-investigations.component';
import { TemplateComponent } from './template/template.component';
import { SelectTemplateComponent } from './template/select-template/select-template.component';
import { ScopeLevelService } from '../../../services/module-manager/setup/index';
// import { LabRequestsComponent } from './lab-requests/lab-requests.component';
import { RadRequestDetailComponent } from './lab-requests/request-detail/request-detail.component';
import { RadiologyInvestigationService } from 'app/services/facility-manager/setup/radiologyinvestigation.service';
// tslint:disable-next-line:max-line-length
import { RadiologyInvestigationServiceComponent } from '../radiology/radiology-investigation-service/radiology-investigation-service.component';
import { OnlyMaterialModule } from '../../../shared-common-modules/only-material-module';


@NgModule({
  imports: [
    // CommonModule,
    radiologyRoutes,
    OnlyMaterialModule,
    MaterialModule
  ],
  declarations: [RadiologyComponent, RadiologyInvestigationServiceComponent, RadRequestDetailComponent,
    RadiologyInvestigationPriceComponent, PanelComponent, ReportComponent, ReportDetailComponent,
    ExternalInvestigationsComponent, TemplateComponent, SelectTemplateComponent],
  providers: [LaboratoryRequestService, ScopeLevelService,RadiologyInvestigationService]
})
export class RadiologyModule { }
