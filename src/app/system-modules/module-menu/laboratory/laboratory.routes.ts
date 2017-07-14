import { RouterModule, Routes } from '@angular/router';
import { LaboratoryHomePageComponent } from './laboratory-home-page/laboratory-home-page.component';
import { LaboratoryListsComponent } from './laboratory-lists/laboratory-lists.component';



const LABORATORYMODULES_ROUTES: Routes = [
    {
        path: '', component: LaboratoryHomePageComponent, children: [
            { path: '', redirectTo: 'Laboratory-lists' },
            { path: 'laboratory-lists', component: LaboratoryListsComponent },         
        ]
    }
];

export const laboratoryRoutes = RouterModule.forChild(LABORATORYMODULES_ROUTES);