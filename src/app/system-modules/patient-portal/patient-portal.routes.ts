import { RouterModule, Routes } from '@angular/router';
import { PatientPortalComponent } from './patient-portal.component';
import { PatientPortalHomeComponent } from './patient-portal-home.component';
// import { PatientmanagerDetailpageComponent } from './patientmanager-detailpage/patientmanager-detailpage.component';
// import { PatientResolverService, AppointmentResolverService, LoginEmployeeResolverService } from '../../../resolvers/module-menu/index';

const PATIENTPORTAL_ROUTES: Routes = [
    {
        path: '', component: PatientPortalHomeComponent, children: [
            { path: '', component: PatientPortalComponent },
            // { path: 'patient-manager-detail', component: PatientmanagerDetailpageComponent },
            {
                // path: 'patient-manager-detail/:id', component: PatientmanagerDetailpageComponent
                // resolve: { patient: PatientResolverService, appointment: AppointmentResolverService,
                // loginEmployee: LoginEmployeeResolverService }
            }
        ]
    }
];

export const patientPortalRoutes = RouterModule.forChild(PATIENTPORTAL_ROUTES);
