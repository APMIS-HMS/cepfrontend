import { SystemModuleComponent } from './../system-module.component';
import { homePageRoutes } from './home-page.routes';
import { MaterialModule } from './../../shared-common-modules/material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { HomePageHomeComponent } from './home-page-home.component';
import { PersonLandingComponent } from './person-landing/person-landing.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    homePageRoutes,
    
  ],
  declarations: [
    HomePageComponent,
    HomePageHomeComponent,
    PersonLandingComponent,
  ]
})
export class HomePageModule { }
