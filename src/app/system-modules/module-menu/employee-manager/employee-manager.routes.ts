import { RouterModule, Routes } from '@angular/router';
import { EmployeeManagerComponent } from './employee-manager.component';
import { EmployeeManagerHomeComponent } from './employee-manager-home.component';
import { EmployeemanagerDetailpageComponent } from './employeemanager-detailpage/employeemanager-detailpage.component';
import { GenerateUserComponent } from './employeemanager-detailpage/generate-user/generate-user.component';
import { EditUserComponent } from './employeemanager-detailpage/edit-user/edit-user.component';
import { EmployeesResolverService } from '../../../resolvers/module-menu/index';

const EMPLOYEEMANAGER_ROUTES: Routes = [
    {
        path: '', component: EmployeeManagerHomeComponent, children: [
            { path: '', component: EmployeeManagerComponent, resolve: { employees: EmployeesResolverService } },
            // { path: 'employee-manager', component: EmployeeManagerComponent },
            { path: 'detail', component: EmployeemanagerDetailpageComponent },
            { path: 'detail/:id', component: EmployeemanagerDetailpageComponent },
            { path: 'generate-user', component: GenerateUserComponent },
            { path: 'generate-user/:id', component: GenerateUserComponent },
            { path: 'edit-user', component: EditUserComponent },
            { path: 'edit-user/:id/:personId', component: EditUserComponent }
        ]
    }
]; 

export const employeeManagerRoutes = RouterModule.forChild(EMPLOYEEMANAGER_ROUTES);