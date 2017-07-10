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
//import { } from '../../material';

import { StoreEmitterService } from '../../../services/facility-manager/store-emitter.service';

import {
    DxSchedulerModule,
    DxButtonModule, DxTextAreaModule, DxCheckBoxModule, DxSelectBoxModule,
    DxTemplateModule, DxAutocompleteModule, DxLookupModule, DxDateBoxModule
} from 'devextreme-angular';
// import 'devextreme-intl';

@NgModule({
    declarations: [
        StoreComponent,
        LandingPageComponent,
        NewStoreComponent
    ],

    exports: [
    ],
    imports: [
        //SharedModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        storeRoutes,
        // DxSchedulerModule, DxButtonModule, DxTemplateModule,
        // DxAutocompleteModule, DxLookupModule, DxTextAreaModule, DxDateBoxModule
    ],
    providers: [StoreEmitterService, ProductTypeService, StoreService, ProductService,
        GenericService, ManufacturerService, RouteService, SupplierService]
})
export class StoreModule { }



