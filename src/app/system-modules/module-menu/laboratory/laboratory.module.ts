import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaboratoryHomePageComponent } from './laboratory-home-page/laboratory-home-page.component';
import { LaboratoryListsComponent } from './laboratory-lists/laboratory-lists.component';
import { LaboratoryComponent } from './laboratory/laboratory.component';
import { laboratoryRoutes } from './laboratory.routes';

@NgModule({
  imports: [
    CommonModule,
    laboratoryRoutes
  ],
  declarations: [LaboratoryHomePageComponent, LaboratoryListsComponent, LaboratoryComponent]
})
export class LaboratoryModule { }
