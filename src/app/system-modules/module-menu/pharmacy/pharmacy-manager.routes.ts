import { RouterModule, Routes } from '@angular/router';
import { PharmacyManagerComponent } from './pharmacy-manager.component';
import { PrescriptionListComponent } from './prescription-list/prescription-list.component';
import { PrescriptionComponent } from './dispense/prescription/prescription.component';
import {DispenseComponent} from './dispense/dispense.component';
import { LoginEmployeeResolverService } from '../../../resolvers/module-menu/index';

const PHARMACYMODULES_ROUTES: Routes = [
    {
        path: '', component: PharmacyManagerComponent, children: [
            { path: '', redirectTo: 'prescriptions', pathMatch: 'full' },
            { path: 'prescriptions', component: PrescriptionListComponent },
            { path: 'prescriptions/:id', component: PrescriptionComponent },
            { 
                path: 'dispense', 
                component: DispenseComponent,
                resolve: { loginEmployee: LoginEmployeeResolverService }
            }
        ]
    }
];

export const pharmacyManagerRoutes = RouterModule.forChild(PHARMACYMODULES_ROUTES);
