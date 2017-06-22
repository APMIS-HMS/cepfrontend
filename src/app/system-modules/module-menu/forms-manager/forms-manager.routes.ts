import { RouterModule, Routes } from '@angular/router';
import { FormsComponent } from './forms/forms.component';

import { FormsManagerComponent } from './forms-manager.component';
import { SystemModulesResolverService } from '../../../resolvers/module-menu/index';
import { ScopeLevelResolverService, FormTypeResolverService } from '../../../resolvers/module-manager/index';

const FORMSMANAGERMODULES_ROUTES: Routes = [
    {
        path: '', component: FormsManagerComponent, children: [
            { path: '', redirectTo: 'forms' },
            {
                path: 'forms', component: FormsComponent, resolve: {
                    modules: SystemModulesResolverService, documentTypes: FormTypeResolverService,
                    scopeLevels: ScopeLevelResolverService
                }
            },
        ]
    }
];

export const formsManagerRoutes = RouterModule.forChild(FORMSMANAGERMODULES_ROUTES);