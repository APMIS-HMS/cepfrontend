import { RouterModule, Routes } from '@angular/router';
import {LabComponent} from './lab.component';
import {LabRequestsComponent} from './lab-requests/lab-requests.component';
import { WorkbenchComponent } from './workbench/workbench.component';
import { InvestigationServiceComponent } from './investigation-service/investigation-service.component';
import { InvestigationPriceComponent } from './investigation-price/investigation-price.component';
import { PanelComponent } from './panel/panel.component';

const LABMODULES_ROUTES: Routes = [
    {
        path: '', component: LabComponent, children: [
            { path: '', redirectTo: 'requests' },
            { path: 'requests', component: LabRequestsComponent },
            { path: 'workbench', component: WorkbenchComponent },
            { path: 'investigation', component: InvestigationServiceComponent },
            { path: 'investigation-pricing', component: InvestigationPriceComponent },
            { path: 'panel', component: PanelComponent },
        ]
    }
];

export const labRoutes = RouterModule.forChild(LABMODULES_ROUTES);
