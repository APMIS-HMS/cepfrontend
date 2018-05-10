import { RouterModule, Routes } from '@angular/router';
import {ImmunizationComponent} from './immunization.component';
import { ImmunizationScheduleComponent } from './immunization-schedule/immunization-schedule.component';


const IMMUNIZATIONMODULES_ROUTES: Routes = [
    {
        path: '', component: ImmunizationComponent, children: [
            { path: '', redirectTo: 'immunization-schedule' },
            { path: 'immunization-schedule', component: ImmunizationScheduleComponent },
        ]
    }
];

export const immunizationRoutes = RouterModule.forChild(IMMUNIZATIONMODULES_ROUTES);
