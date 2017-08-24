import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { BillingHomeComponent } from './billing-home/billing-home.component';
import { BillingComponent } from './billing.component';
import { billingRoutes } from './billing.routes';
import { BillingHomePageComponent } from './billing-home-page/billing-home-page.component';
import { ServicesComponent } from './services/services.component';
import { NewServiceComponent } from './services/new-service/new-service.component';
import { NewCategoryComponent } from './services/new-category/new-category.component';
import { NewPriceComponent } from './billing-home-page/new-price/new-price.component';
import { NewModefierComponent } from './billing-home-page/new-modefier/new-modefier.component';
import { ServiceDetailComponent } from './billing-home-page/service-detail/service-detail.component';
import { AddTagComponent } from '../add-tag/add-tag.component';
import { MaterialModule } from '../../../shared-common-modules/material-module';

@NgModule({
    declarations: [
    BillingHomeComponent,
    BillingComponent,
    BillingHomePageComponent,
    ServicesComponent,
    NewServiceComponent,
    NewCategoryComponent,
    NewPriceComponent,
    NewModefierComponent,
    ServiceDetailComponent],
    exports: [
    ],
    imports: [
        MaterialModule,
        billingRoutes
    ],
    providers: []
})
export class BillingModule { }



