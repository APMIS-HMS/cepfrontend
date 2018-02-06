import { GenerateUserComponent } from './employees/employeemanager-detailpage/generate-user/generate-user.component';
import { EmpmanagerDetailpageComponent } from './employees/employeemanager-detailpage/empmanager-detailpage.component';
import { EmployeesResolverService } from './../../../resolvers/module-menu/employees-resolver.service';
import { RouterModule, Routes } from '@angular/router';
import { FacilityPageHomeComponent } from './facility-page-home.component';
import { FacilitypageModulespageComponent } from './facilitypage-modulespage/facilitypage-modulespage.component';
import { FacilitypageDepartmentspageComponent } from './facilitypage-departmentspage/facilitypage-departmentspage.component';
import { FacilitypageLocationspageComponent } from './facilitypage-locationspage/facilitypage-locationspage.component';
import { FacilitypageWorkspaceComponent } from './facilitypage-workspace/facilitypage-workspace.component';
import { FacilityOptionsComponent } from './facility-options/facility-options.component';
import { ProfessionComponent } from './profession/profession.component';
import { FacilityNetworkComponent } from './facility-network/facility-network.component';
import { AccessRoleDetailsComponent } from './facility-access-control/access-role-details/access-role-details.component';
import {
    WorkspaceResolverService, FacilityResolverService, SystemModulesResolverService,
    LocationsResolverService
} from '../../../resolvers/module-menu/index';
import { FacilitypageHomepageComponent } from './facilitypage-homepage/facilitypage-homepage.component';
import { EmpManagerComponent } from './employees/emp-manager.component';
import { EditUserComponent } from './employees/employeemanager-detailpage/edit-user/edit-user.component';


const FACLITYPAGE_ROUTES: Routes = [
    {
        path: '', component: FacilityPageHomeComponent, children: [
            { path: '', component: EmpManagerComponent, resolve: { employees: EmployeesResolverService }},
            // { path: 'facility', component: FacilitypageHomepageComponent },
            // {
            //     path: 'modules', component: FacilitypageModulespageComponent, resolve: {
            //         systemModules: SystemModulesResolverService,
            //         facility: FacilityResolverService
            //     }
            // },
            {
                path: 'employees', component: EmpManagerComponent, resolve: { employees: EmployeesResolverService }
            },
            {
                path: 'employees/:id', component: EmpmanagerDetailpageComponent
            },
            {
                path: 'edit-user', component: EditUserComponent
            },
            { path: 'edit-user/:id/:personId/:empId', component: EditUserComponent },
            { path: 'generate-user', component: GenerateUserComponent },
            { path: 'generate-user/:id/:empId', component: GenerateUserComponent },
            { path: 'locations', component: FacilitypageLocationspageComponent, resolve: { locations: LocationsResolverService } },
            { path: 'workspaces', component: FacilitypageWorkspaceComponent },
            { path: 'departments', component: FacilitypageDepartmentspageComponent, resolve: { facility: FacilityResolverService } },
            { path: 'options', component: FacilityOptionsComponent },
            { path: 'profession', component: ProfessionComponent },
            { path: 'modules', component: FacilitypageModulespageComponent },
            { path: 'network', component: FacilityNetworkComponent },
            { path: 'access', component:AccessRoleDetailsComponent},
        ]
    }
];

export const facilityPageRoutes = RouterModule.forChild(FACLITYPAGE_ROUTES);
