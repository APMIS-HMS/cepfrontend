import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared-module/shared.module';
import { LaboratoryHomePageComponent } from './laboratory-home-page/laboratory-home-page.component';
import { LaboratoryListsComponent } from './laboratory-lists/laboratory-lists.component';
import { LaboratoryComponent } from './laboratory.component';
import { laboratoryRoutes } from './laboratory.routes';
import { NewRequestComponent } from './new-request/new-request.component';


@NgModule({
  imports: [
    CommonModule,
    laboratoryRoutes,
    SharedModule,
  ],
  declarations: [LaboratoryHomePageComponent, LaboratoryListsComponent, LaboratoryComponent, NewRequestComponent]
})
export class LaboratoryModule { }
