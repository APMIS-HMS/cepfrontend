import { RouterModule, Routes } from '@angular/router';
import { PharmacyManagerComponent } from './pharmacy-manager.component';
import { PrescriptionListComponent } from './prescription-list/prescription-list.component';
import { WalkInDetailsComponent } from './prescription-list/walk-in-details/walk-in-details.component';
import { PrescriptionComponent } from './dispense/prescription/prescription.component';
import {DispenseComponent} from './dispense/dispense.component';
import { LoginEmployeeResolverService } from '../../../resolvers/module-menu/index';
import { ExternalPrescriptionComponent } from './external-prescription/external-prescription.component';

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
            },
            { path: 'dispenses/:id', component: WalkInDetailsComponent },
            { path: 'external-prescriptions', component: ExternalPrescriptionComponent },
            { path: 'external-prescriptions/:id', component: PrescriptionComponent }
        ]
    }
];

export const pharmacyManagerRoutes = RouterModule.forChild(PHARMACYMODULES_ROUTES);
