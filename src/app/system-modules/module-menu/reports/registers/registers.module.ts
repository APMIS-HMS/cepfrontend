import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistersRoutingModule } from './registers-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared-module/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RegistersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
  ]
})
export class RegistersModule { }
