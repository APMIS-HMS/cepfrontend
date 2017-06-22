import { RouterModule, Routes } from '@angular/router';
import { SystemModuleComponent } from './system-module.component';

const SYSTEMMODULES_ROUTES: Routes = [
    {
        path: '', component: SystemModuleComponent, children: [
            {
                path: '',
                loadChildren: './module-menu/module-menu.module#ModuleMenu'
            },
            {
                path: 'facility-manager',
                loadChildren: './module-menu/module-menu.module#ModuleMenu'
            },
            {
                path: 'module-manager',
                loadChildren: './module-manager/module-manager.module#ModuleManager'
            },
            {
                path: 'corporate',
                loadChildren: './corporate-account/corporate-account.module#CorporateAccountModule'
            },
            // {
            //     path: 'corporate', component: CorporateAccountComponent
            // }
        ]
    }
];

export const systemModulesRoutes = RouterModule.forChild(SYSTEMMODULES_ROUTES);