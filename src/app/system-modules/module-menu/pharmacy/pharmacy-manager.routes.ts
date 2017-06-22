import { RouterModule, Routes } from '@angular/router';
import { PharmacyManagerComponent } from './pharmacy-manager.component';
import { PrescriptionListComponent } from './prescription-list/prescription-list.component';
import {DispenseComponent} from './dispense/dispense.component';

const PHARMACYMODULES_ROUTES: Routes = [
    {
        path: '', component: PharmacyManagerComponent, children: [
            { path: '', redirectTo: 'prescription-list' },
            { path: 'prescription-list', component: PrescriptionListComponent },
            { path: 'dispense', component: DispenseComponent }
        ]
    }
];

export const pharmacyManagerRoutes = RouterModule.forChild(PHARMACYMODULES_ROUTES);
