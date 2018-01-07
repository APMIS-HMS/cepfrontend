import { RouterModule, Routes } from '@angular/router';
import { FacilityPageHomeComponent } from './facility-page-home.component';
import { FacilitypageModulespageComponent } from './facilitypage-modulespage/facilitypage-modulespage.component';
import { FacilitypageDepartmentspageComponent } from './facilitypage-departmentspage/facilitypage-departmentspage.component';
import { FacilitypageLocationspageComponent } from './facilitypage-locationspage/facilitypage-locationspage.component';
import { FacilitypageWorkspaceComponent } from './facilitypage-workspace/facilitypage-workspace.component';
import { FacilityOptionsComponent } from './facility-options/facility-options.component';
import { ProfessionComponent } from './profession/profession.component';

import {
    WorkspaceResolverService, FacilityResolverService, SystemModulesResolverService,
    LocationsResolverService
} from '../../../resolvers/module-menu/index';
import { FacilitypageHomepageComponent } from './facilitypage-homepage/facilitypage-homepage.component';


const FACLITYPAGE_ROUTES: Routes = [
    {
        path: '', component: FacilityPageHomeComponent, children: [
            { path: '', component: FacilitypageHomepageComponent },
            { path: 'facility', component: FacilitypageHomepageComponent },
            {
                path: 'modules', component: FacilitypageModulespageComponent, resolve: {
                    systemModules: SystemModulesResolverService,
                    facility: FacilityResolverService
                }
            }, 
            {
                path: 'employees',
                loadChildren: '../module-menu/employee-manager/employee-manager.module#EmployeeManagerModule',
            },
            // {
            //     path: 'employees/:id',
            //     loadChildren: '../module-menu/employee-manager/employee-manager.module#EmployeeManagerModule',
            // },
            { path: 'locations', component: FacilitypageLocationspageComponent, resolve: { locations: LocationsResolverService } },
            { path: 'workspaces', component: FacilitypageWorkspaceComponent, resolve: { workSpaces: WorkspaceResolverService } },
            { path: 'departments', component: FacilitypageDepartmentspageComponent, resolve: { facility: FacilityResolverService } },
            { path: 'options', component: FacilityOptionsComponent },
            { path: 'profession', component: ProfessionComponent },
        ]
    }
];

export const facilityPageRoutes = RouterModule.forChild(FACLITYPAGE_ROUTES);
