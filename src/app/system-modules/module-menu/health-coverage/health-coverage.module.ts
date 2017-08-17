import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { healthCoverRoutes } from './health-coverage.routes';

import { HealthCoverageComponent } from './health-coverage.component';
import { CompanyCoverComponent } from './company-cover/company-cover.component';
import { PersonDependantsComponent } from './person-dependants/person-dependants.component';
import { FamilyCoverComponent } from './family-cover/family-cover.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AddPrincipalComponent } from './add-principal/add-principal.component';
import { HmoCoverComponent } from './hmo-cover/hmo-cover.component';
import { StaffCoverComponent } from './staff-cover/staff-cover.component';
import { MaterialModule } from '../../../shared-common-modules/material-module';
@NgModule({
    declarations: [
        CompanyCoverComponent,
        PersonDependantsComponent,
        HealthCoverageComponent,
        FamilyCoverComponent,
        AddEmployeeComponent,
        AddPrincipalComponent,
        HmoCoverComponent,
        StaffCoverComponent
    ],
    exports: [
    ],
    imports: [
        MaterialModule,
        healthCoverRoutes
    ],
    providers: []
})
export class HealthCoverageModule { }



