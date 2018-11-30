import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApmisStoreRoutingModule } from './apmis-store-routing.module';
import { ApmisStoreLandingpageComponent } from './apmis-store-landingpage.component';
import { ApmisStoreHomeComponent } from './apmis-store-home/apmis-store-home.component';
import { StoreHomeAnalyticsComponent } from './apmis-store-home/store-home-analytics/store-home-analytics.component';
import { StoreHomeMainComponent } from './apmis-store-home/store-home-main/store-home-main.component';
import { AllProductsComponent } from './apmis-store-home/store-home-main/all-products/all-products.component';
import { ApmisStoreProductComponent } from './apmis-store-product/apmis-store-product.component';
import { AdjustStockComponent } from './apmis-store-product/adjust-stock/adjust-stock.component';
import { CheckProductDistributionComponent } from './apmis-store-product/check-product-distribution/check-product-distribution.component';
import { ExpiringProductsComponent } from './apmis-store-home/store-home-main/expiring-products/expiring-products.component';
import { ExpiredProductsComponent } from './apmis-store-home/store-home-main/expired-products/expired-products.component';
import { ProductRequisitionComponent } from './apmis-store-home/store-home-main/product-requisition/product-requisition.component';
import { ProductRestockComponent } from './apmis-store-home/store-home-main/product-restock/product-restock.component';
import { StoreStoresComponent } from './store-stores/store-stores.component';
import { StoreTabComponent } from './store-stores/store-tab/store-tab.component';
import { OnlyMaterialModule } from 'app/shared-common-modules/only-material-module';
import { StoreService, InventoryService,ProductTypeService } from 'app/services/facility-manager/setup';
import { ApmisPaginationComponent } from './components/apmis-pagination/apmis-pagination.component';
import { StoreGlobalUtilService } from './store-utils/global-service';
import { ApmisNewStoreComponent } from './store-stores/apmis-new-store/apmis-new-store.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApmisSearchComponent } from './components/apmis-search/apmis-search.component';
import { ProductCongurationComponent } from './apmis-store-product/product-conguration/product-conguration.component';
import { ApmisSearchResultComponent } from './components/apmis-search/apmis-search-result/apmis-search-result.component';

@NgModule({
	imports: [ CommonModule, ApmisStoreRoutingModule, OnlyMaterialModule,
		FormsModule, ReactiveFormsModule ],
	declarations: [
		ApmisStoreLandingpageComponent,
		ApmisStoreHomeComponent,
		StoreHomeAnalyticsComponent,
		StoreHomeMainComponent,
		AllProductsComponent,
		ExpiringProductsComponent,
		ExpiredProductsComponent,
		ProductRequisitionComponent,
		ProductRestockComponent,
		StoreStoresComponent,
		StoreTabComponent,
		ApmisStoreProductComponent,
		ApmisPaginationComponent,
		AdjustStockComponent,
		CheckProductDistributionComponent,
		ApmisNewStoreComponent,
		ProductCongurationComponent,
		ApmisSearchComponent,
		ApmisSearchResultComponent
	],
	providers: [ StoreService, InventoryService, StoreGlobalUtilService,ProductTypeService ]
})
export class ApmisStoreModule {}
