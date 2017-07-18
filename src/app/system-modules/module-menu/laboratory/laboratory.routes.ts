import { RouterModule, Routes } from '@angular/router';
import { LaboratoryHomePageComponent } from './laboratory-home-page/laboratory-home-page.component';
import { LaboratoryListsComponent } from './laboratory-lists/laboratory-lists.component';
import {LaboratoryComponent} from './laboratory.component';
import {NewRequestComponent} from './new-request/new-request.component';
import {WorkbenchSetupComponent} from './workbench-setup/workbench-setup.component'
import {InvestigationServiceSetupComponent} from './investigation-service-setup/investigation-service-setup.component'
import {InvestigationSetupComponent} from './investigation-setup/investigation-setup.component'
import {LabSetupComponent} from './lab-setup/lab-setup.component'



const LABORATORYMODULES_ROUTES: Routes = [
    {
        path: '', component: LaboratoryComponent, children: [
            { path: '', redirectTo: 'laboratory-lists' },
            { path: 'laboratory-lists', component: LaboratoryListsComponent },
            {path: 'new-laboratory-request', component: NewRequestComponent},
            {path: 'laboratory-setup', component: LabSetupComponent},
            {path: 'workbench-setup', component: WorkbenchSetupComponent},
            {path: 'investigation-service-setup', component: InvestigationServiceSetupComponent},
            {path: 'investigation-setup', component: InvestigationSetupComponent}
        ]
    }
];

export const laboratoryRoutes = RouterModule.forChild(LABORATORYMODULES_ROUTES);
