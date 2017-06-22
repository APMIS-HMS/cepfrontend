import { RouterModule, Routes } from '@angular/router';
import { AccessManagerComponent } from './access-manager.component';
import { AccessManagerHomeComponent } from './access-manager-home.component';
import { CreateAccessComponent } from './create-access/create-access.component';
import { ViewAccessComponent } from './view-access/view-access.component';

const EMPLOYEEMANAGER_ROUTES: Routes = [
    {
        path: '', component: AccessManagerHomeComponent, children: [
            { path: '', component: AccessManagerComponent },
            { path: 'access-manager', component: AccessManagerComponent },
            { path: 'access', component: ViewAccessComponent },
            { path: 'new-access', component: CreateAccessComponent },
            { path: 'new-access/:id', component: CreateAccessComponent }
        ]
    }
];

export const accessManagerRoutes = RouterModule.forChild(EMPLOYEEMANAGER_ROUTES);