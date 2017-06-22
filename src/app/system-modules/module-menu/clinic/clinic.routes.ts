import { RouterModule, Routes } from '@angular/router';
import { ClinicComponent } from './clinic.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { ClinicScheduleComponent } from './clinic-schedule/clinic-schedule.component';
import { ConsultingRoomComponent } from './consulting-room/consulting-room.component';
import { CheckInPatientComponent } from './check-in-patient/check-in-patient.component';
import {
    AppointmentsResolverService, AppointmentTypeResolverService, ProfessionsResolverService,
    LoginEmployeeResolverService, LoginEmployeeWorkspaceResolverService
} from '../../../resolvers/module-menu/index';

const CLINICMODULES_ROUTES: Routes = [
    {
        path: '', component: ClinicComponent, children: [
            { path: '', redirectTo: 'appointment' },
            {
                path: 'appointment', component: AppointmentComponent,
                //  resolve: {
                //     appointmentTypes: AppointmentTypeResolverService,
                //     professions: ProfessionsResolverService,
                //     loginEmployeeWorkSpace: LoginEmployeeWorkspaceResolverService
                // }
            },
            { path: 'clinic-schedule', component: ClinicScheduleComponent },
            { path: 'consulting-room', component: ConsultingRoomComponent },
            {
                path: 'check-in', component: CheckInPatientComponent, resolve: {
                    checkInPatients: AppointmentsResolverService,
                    // loginEmployee: LoginEmployeeResolverService
                }
            },
        ]
    }
];

export const clinicRoutes = RouterModule.forChild(CLINICMODULES_ROUTES);
