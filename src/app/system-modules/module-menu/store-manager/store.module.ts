import { OnlyMaterialModule } from './../../../shared-common-modules/only-material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { storeRoutes } from './store.routes';
import { StoreComponent } from './store.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NewStoreComponent } from './new-store/new-store.component';
import {
    ProductTypeService, StoreService, ProductService, ManufacturerService, GenericService,
    RouteService, SupplierService
} from '../../../services/facility-manager/setup/index';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { StoreEmitterService } from '../../../services/facility-manager/store-emitter.service';
import { StoreHomeComponent } from './store-home/store-home.component';
import { QuickLinksComponent } from './quick-links/quick-links.component';
import { PosComponent } from './pos/pos.component';
import { PosDiscountComponent } from './pos/pos-discount/pos-discount.component';



@NgModule({
    declarations: [
        StoreComponent,
        LandingPageComponent,
        NewStoreComponent,
        StoreHomeComponent,
        QuickLinksComponent,
        PosComponent,
        PosDiscountComponent
    ],

    exports: [
    ],
    imports: [
        OnlyMaterialModule,
        MaterialModule,
        storeRoutes
    ],
    providers: [StoreEmitterService, ProductTypeService, StoreService, ProductService,
        GenericService, ManufacturerService, RouteService, SupplierService]
})
export class StoreModule { }



