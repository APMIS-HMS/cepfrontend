import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'ng2-datepicker';
import { AccessManagerComponent } from './access-manager.component';

import { CreateAccessComponent } from './create-access/create-access.component';
import { ViewAccessComponent } from './view-access/view-access.component';

import { AccessManagerHomeComponent } from './access-manager-home.component';
import { accessManagerRoutes} from './access-manager.routes';
import { MaterialModule } from '../../../shared-common-modules/material-module';
// import { SharedModule } from '../../../shared-module/shared.module';

@NgModule({
    declarations: [
        AccessManagerComponent,
        CreateAccessComponent,
        ViewAccessComponent,
        AccessManagerHomeComponent
    ],
    exports: [
    ],
    imports: [
        // CommonModule,
        // ReactiveFormsModule,
        // FormsModule,
        MaterialModule,
        DatePickerModule,
        accessManagerRoutes,
        // SharedModule
    ],
    providers: []
})
export class AccessManagerModule { }



