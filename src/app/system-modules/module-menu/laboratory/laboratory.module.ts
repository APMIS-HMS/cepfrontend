import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared-module/shared.module';
import { LaboratoryHomePageComponent } from './laboratory-home-page/laboratory-home-page.component';
import { LaboratoryListsComponent } from './laboratory-lists/laboratory-lists.component';
import { LaboratoryComponent } from './laboratory.component';
import { laboratoryRoutes } from './laboratory.routes';
import { NewRequestComponent } from './new-request/new-request.component';
import { LabSetupComponent } from './lab-setup/lab-setup.component';
import { WorkbenchSetupComponent } from './workbench-setup/workbench-setup.component';
import { InvestigationServiceSetupComponent } from './investigation-service-setup/investigation-service-setup.component';
import { InvestigationSetupComponent } from './investigation-setup/investigation-setup.component';
import { AddWorkbenchComponent } from './workbench-setup/add-workbench/add-workbench.component';
import { AddPersonComponent } from './new-request/add-person/add-person.component';
import { InvestigationComponent } from './new-request/investigation/investigation.component';
import { ClientDetailsComponent } from './new-request/client-details/client-details.component';


@NgModule({
  imports: [
    CommonModule,
    laboratoryRoutes,
    SharedModule,
  ],
  declarations: [LaboratoryHomePageComponent, LaboratoryListsComponent, LaboratoryComponent, NewRequestComponent, LabSetupComponent, WorkbenchSetupComponent, InvestigationServiceSetupComponent, InvestigationSetupComponent, AddWorkbenchComponent, AddPersonComponent, InvestigationComponent, ClientDetailsComponent]
})
export class LaboratoryModule { }
