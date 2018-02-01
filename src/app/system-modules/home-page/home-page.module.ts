import { SystemModuleComponent } from './../system-module.component';
import { homePageRoutes } from './home-page.routes';
import { MaterialModule } from './../../shared-common-modules/material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { HomePageHomeComponent } from './home-page-home.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    homePageRoutes,
    
  ],
  declarations: [
    HomePageComponent,
    HomePageHomeComponent,
  ]
})
export class HomePageModule { }
