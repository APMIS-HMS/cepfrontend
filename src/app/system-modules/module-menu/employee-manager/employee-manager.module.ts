import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'ng2-datepicker';
import { EmployeeManagerComponent } from './employee-manager.component';
import { employeeManagerRoutes } from './employee-manager.routes';
import { EmployeeManagerHomeComponent } from './employee-manager-home.component';
import { EmployeemanagerHomepageComponent } from './employeemanager-homepage/employeemanager-homepage.component';
import { EmployeemanagerDetailpageComponent } from './employeemanager-detailpage/employeemanager-detailpage.component';
import { GenerateUserComponent } from './employeemanager-detailpage/generate-user/generate-user.component';
import { EditUserComponent } from './employeemanager-detailpage/edit-user/edit-user.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { EmployeeLookupComponent } from './employeemanager-detailpage/employee-lookup/employee-lookup.component';
import { ApmisCheckboxComponent } from './employeemanager-detailpage/apmis-checkbox/apmis-checkbox.component';
import { ApmisCheckboxChildComponent } from './employeemanager-detailpage/apmis-checkbox/apmis-checkbox-child.component';
import { SharedModule } from '../../../shared-module/shared.module';
import { ApmisCheckboxFeatureComponent } from './employeemanager-detailpage/apmis-checkbox/apmis-checkbox-feature.component';
import { EditUserAccessControlComponent } from './employeemanager-detailpage/edit-user/edit-user-access-control.component';
import { EditUserFeaturesComponent } from './employeemanager-detailpage/edit-user/edit-user-features.component';
import { NewWorkspaceComponent } from './new-workspace/new-workspace.component';
import { WorkspaceHistoryComponent } from './workspace-history/workspace-history.component';
import { AssignUnitComponent } from './assign-unit/assign-unit.component';
import { EmployeesResolverService, LoginEmployeeResolverService } from '../../../resolvers/module-menu/index'
import { MaterialModule } from '../../../shared-common-modules/material-module';

@NgModule({
    declarations: [
        EmployeeManagerComponent,
        EmployeeManagerHomeComponent,
        EmployeemanagerHomepageComponent,
        EmployeemanagerDetailpageComponent,
        GenerateUserComponent,
        EditUserComponent,
        NewEmployeeComponent,
        EmployeeLookupComponent,
        ApmisCheckboxComponent,
        ApmisCheckboxChildComponent,
        ApmisCheckboxFeatureComponent,
        EditUserAccessControlComponent,
        EditUserFeaturesComponent,
        NewWorkspaceComponent,
        WorkspaceHistoryComponent,
        AssignUnitComponent
    ],
    exports: [
    ],
    imports: [
        employeeManagerRoutes,
        MaterialModule
    ],
    providers: [EmployeesResolverService, LoginEmployeeResolverService]
})
export class EmployeeManagerModule { }



