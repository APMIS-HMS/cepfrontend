import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { pharmacyManagerRoutes } from './pharmacy-manager.routes';
import { PharmacyManagerComponent } from './pharmacy-manager.component';
import {
    StoreService, ManufacturerService, GenericService,
    RouteService, SupplierService, PresentationService, StrengthService, PurchaseEntryService
} from '../../../services/facility-manager/setup/index';

import { PharmacyEmitterService } from '../../../services/facility-manager/pharmacy-emitter.service';
import { PharmacyManagerLandingpageComponent } from './pharmacy-manager-landingpage/pharmacy-manager-landingpage.component';
import { PrescriptionListComponent } from './prescription-list/prescription-list.component';
import { DispenseComponent } from './dispense/dispense.component';
import { PrescriptionComponent } from './dispense/prescription/prescription.component';
import { NoprescriptionComponent } from './dispense/noprescription/noprescription.component';

@NgModule({
    declarations: [
        PharmacyManagerComponent,
        PharmacyManagerLandingpageComponent,
        PrescriptionListComponent,
        DispenseComponent,
        PrescriptionComponent,
        NoprescriptionComponent,
    ],

    exports: [
    ],
    imports: [
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        pharmacyManagerRoutes
    ],
    providers: [PharmacyEmitterService, StoreService, PresentationService,
        GenericService, ManufacturerService, RouteService, SupplierService, StrengthService, PurchaseEntryService]
})
export class PharmacyManagerModule { }



