import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'ng2-datepicker';
import { SharedModule } from '../../../shared-module/shared.module';
import { wardManagerRoutes } from './ward-manager.routes';
import { WardManagerAdmissionpageComponent } from './ward-manager-admissionpage/ward-manager-admissionpage.component';
import { WardManagerSetuppageComponent } from './ward-manager-setuppage/ward-manager-setuppage.component';
import { WardManagerComponent } from './ward-manager.component';
import { AdmitPatientComponent } from './admit-patient/admit-patient.component';
import { WardManagerAdmittedpageComponent } from './ward-manager-admittedpage/ward-manager-admittedpage.component';
import { WardManagerAdmittedDetailspageComponent } from './ward-manager-admitted-detailspage/ward-manager-admitted-detailspage.component';
import { WardManagerListpageComponent } from './ward-manager-listpage/ward-manager-listpage.component';
import { RoomComponent } from './ward-manager-setuppage/room/room.component';
import { BedComponent } from './ward-manager-setuppage/bed/bed.component';
import { AddRoomComponent } from './ward-manager-setuppage/add-room/add-room.component';
import { AddBedComponent } from './ward-manager-setuppage/add-bed/add-bed.component';
import { DischargePatientComponent } from './discharge-patient/discharge-patient.component';
import { TransferPatientComponent } from './transfer-patient/transfer-patient.component';
import { WardEmitterService } from '../../../services/facility-manager/ward-emitter.service';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { BillDetailsComponent } from './ward-manager-admitted-detailspage/bill-details/bill-details.component';

@NgModule({
    declarations: [
    WardManagerComponent,
    WardManagerAdmissionpageComponent,
    WardManagerSetuppageComponent,
    AdmitPatientComponent,
    WardManagerAdmittedpageComponent,
    WardManagerAdmittedDetailspageComponent,
    WardManagerListpageComponent,
    RoomComponent,
    BedComponent,
    AddRoomComponent,
    AddBedComponent,
    DischargePatientComponent,
    TransferPatientComponent,
    BillDetailsComponent],
    exports: [
    ],
    imports: [
        SharedModule,
        MaterialModule,
        // CommonModule,
        // ReactiveFormsModule,
        // FormsModule,
        wardManagerRoutes,
        // DatePickerModule
    ],
    providers: [WardEmitterService]
})
export class WardManagerModule { }



