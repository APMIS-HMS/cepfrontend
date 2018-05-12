import { RouterModule, Routes } from '@angular/router';
import {ImmunizationComponent} from './immunization.component';


const IMMUNIZATIONMODULES_ROUTES: Routes = [
    {
        path: '', component: ImmunizationComponent
    }
];

export const immunizationRoutes = RouterModule.forChild(IMMUNIZATIONMODULES_ROUTES);
