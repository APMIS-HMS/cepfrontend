import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApmisStoreRoutingModule } from './apmis-store-routing.module';
import { ApmisStoreLandingpageComponent } from './apmis-store-landingpage.component';
import { ApmisStoreHomeComponent } from './apmis-store-home/apmis-store-home.component';
import { StoreHomeAnalyticsComponent } from './apmis-store-home/store-home-analytics/store-home-analytics.component';
import { StoreHomeMainComponent } from './apmis-store-home/store-home-main/store-home-main.component';
import { AllProductsComponent } from './apmis-store-home/store-home-main/all-products/all-products.component';
import { ExpiringProductsComponent } from './apmis-store-home/store-home-main/expiring-products/expiring-products.component';
import { ExpiredProductsComponent } from './apmis-store-home/store-home-main/expired-products/expired-products.component';
import { ProductRequisitionComponent } from './apmis-store-home/store-home-main/product-requisition/product-requisition.component';
import { ProductRestockComponent } from './apmis-store-home/store-home-main/product-restock/product-restock.component';
import { StoreStoresComponent } from './store-stores/store-stores.component';
import { StoreTabComponent } from './store-stores/store-tab/store-tab.component';
import { ApmisNewStoreComponent } from './store-stores/apmis-new-store/apmis-new-store.component';

@NgModule({
  imports: [
    CommonModule,
    ApmisStoreRoutingModule
  ],
  declarations: [ApmisStoreLandingpageComponent, ApmisStoreHomeComponent, StoreHomeAnalyticsComponent, StoreHomeMainComponent, AllProductsComponent, ExpiringProductsComponent, ExpiredProductsComponent, ProductRequisitionComponent, ProductRestockComponent, StoreStoresComponent, StoreTabComponent, ApmisNewStoreComponent]
})
export class ApmisStoreModule { }
