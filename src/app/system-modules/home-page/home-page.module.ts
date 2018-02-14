import { SystemModuleComponent } from './../system-module.component';
import { homePageRoutes } from './home-page.routes';
import { MaterialModule } from './../../shared-common-modules/material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { HomePageHomeComponent } from './home-page-home.component';
import { PersonLandingComponent } from './person-landing/person-landing.component';
import { PersonScheduleAppointmentComponent } from './person-landing/person-schedule-appointment/person-schedule-appointment.component';
import { BiodataPopupComponent } from './biodata-popup/biodata-popup.component';
import { OnlyMaterialModule } from '../../shared-common-modules/only-material-module';

@NgModule({
  imports: [
    CommonModule,
    OnlyMaterialModule,
    MaterialModule,
    homePageRoutes,
    
  ],
  declarations: [
    HomePageComponent,
    HomePageHomeComponent,
    PersonLandingComponent,
    PersonScheduleAppointmentComponent,
    BiodataPopupComponent,
  ]
})
export class HomePageModule { }
