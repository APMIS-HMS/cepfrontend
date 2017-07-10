import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { facilityPageRoutes } from './facility-page.routes';
import { FacilityPageHomeComponent } from './facility-page-home.component';


import { FacilitypageHomepageComponent } from './facilitypage-homepage/facilitypage-homepage.component';
import { FacilitypageDepartmentspageComponent } from './facilitypage-departmentspage/facilitypage-departmentspage.component';
import { FacilitypageModulespageComponent } from './facilitypage-modulespage/facilitypage-modulespage.component';
import { FacilitypageLocationspageComponent } from './facilitypage-locationspage/facilitypage-locationspage.component';

import { NewDepartmentComponent } from './facilitypage-departmentspage/new-department/new-department.component';
import { NewUnitComponent } from './facilitypage-departmentspage/new-unit/new-unit.component';
import { NewSubLocationComponent } from './facilitypage-locationspage/new-sub-location/new-sub-location.component';
import { UnitComponentComponent } from './facilitypage-departmentspage/unit-component/unit-component.component';
import { SubLocationComponent } from './facilitypage-locationspage/sub-location/sub-location.component';
import { FacilityOptionsComponent } from './facility-options/facility-options.component';
import { FacilitypageWorkspaceComponent } from './facilitypage-workspace/facilitypage-workspace.component';
import { SharedModule } from '../../../shared-module/shared.module';
import {
    WorkspaceResolverService, SystemModulesResolverService, FacilityResolverService,
    LocationsResolverService
} from '../../../resolvers/module-menu/index';
import { ProfessionComponent } from './profession/profession.component';
import { AddProfessionComponent } from './profession/add-profession/add-profession.component';
import { FacilityPageComponent } from './facility-page.component';
import { MaterialModule } from '../../../shared-common-modules/material-module';


@NgModule({
    declarations: [
        FacilityPageHomeComponent,
        FacilitypageHomepageComponent,
        FacilitypageDepartmentspageComponent,
        FacilitypageModulespageComponent,
        FacilitypageLocationspageComponent,
        NewDepartmentComponent,
        NewUnitComponent,
        NewSubLocationComponent,
        UnitComponentComponent,
        SubLocationComponent,
        FacilityOptionsComponent,
        FacilitypageWorkspaceComponent,
        ProfessionComponent,
        AddProfessionComponent,
        FacilityPageComponent,

    ],
    exports: [
    ],
    imports: [
        facilityPageRoutes,
        facilityPageRoutes,
        MaterialModule
    ],
    providers: [
        WorkspaceResolverService, LocationsResolverService,
        SystemModulesResolverService, FacilityResolverService
    ]
})
export class FacilityPageModule { }



