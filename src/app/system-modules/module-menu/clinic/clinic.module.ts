import { OnlyMaterialModule } from './../../../shared-common-modules/only-material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { ClinicHomeComponent } from './clinic-home/clinic-home.component';
import { ClinicComponent } from './clinic.component';
import { clinicRoutes } from './clinic.routes';
import { ClinicScheduleComponent } from './clinic-schedule/clinic-schedule.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { CheckInPatientComponent } from './check-in-patient/check-in-patient.component';
import { Service } from '../../../services/facility-manager/setup/devexpress.service';
import { ConsultingRoomComponent } from './consulting-room/consulting-room.component';
import { ConsultingRoomCheckinComponent } from './consulting-room-checkin/consulting-room-checkin.component';
import {
    PatientResolverService, AppointmentsResolverService, AppointmentTypeResolverService,
    ProfessionsResolverService, LoginEmployeeResolverService, LoginEmployeeWorkspaceResolverService
} from '../../../resolvers/module-menu/index';
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { ScheduleFrmComponent } from './new-appointment/schedule-frm/schedule-frm.component';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { DateRangePickerModule } from 'ng-pick-daterange';
import { DateTimePickerModule } from 'ng-pick-datetime';
import { FormsService, TimezoneService } from '../../../services/facility-manager/setup/index';

@NgModule({
    declarations: [
        ClinicComponent,
        ClinicHomeComponent,
        ClinicScheduleComponent,
        AppointmentComponent,
        CheckInPatientComponent,
        ConsultingRoomComponent,
        ConsultingRoomCheckinComponent,
        NewAppointmentComponent,
        ScheduleFrmComponent],
    exports: [
    ],
    imports: [
        clinicRoutes,
        OnlyMaterialModule,
        MaterialModule,
        DateRangePickerModule,
        DateTimePickerModule
    ],
    providers: [
        Service,
        PatientResolverService,
        AppointmentsResolverService,
        ProfessionsResolverService,
        AppointmentTypeResolverService,
        LoginEmployeeResolverService,
        LoginEmployeeWorkspaceResolverService,
        FormsService, TimezoneService
    ]
})
export class ClinicModule { }



