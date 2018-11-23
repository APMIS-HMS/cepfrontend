import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApmisStoreRoutingModule } from './apmis-store-routing.module';
import { ApmisStoreLandingpageComponent } from './apmis-store-landingpage.component';
import { ApmisStoreHomeComponent } from './apmis-store-home/apmis-store-home.component';
import { StoreHomeAnalyticsComponent } from './apmis-store-home/store-home-analytics/store-home-analytics.component';
import { StoreHomeMainComponent } from './apmis-store-home/store-home-main/store-home-main.component';
import { AllProductsComponent } from './apmis-store-home/store-home-main/all-products/all-products.component';
import { ApmisPaginationComponent } from './components/apmis-pagination/apmis-pagination.component';

@NgModule({
	imports: [ CommonModule, ApmisStoreRoutingModule ],
	declarations: [
		ApmisStoreLandingpageComponent,
		ApmisStoreHomeComponent,
		StoreHomeAnalyticsComponent,
		StoreHomeMainComponent,
		AllProductsComponent,
		ApmisPaginationComponent
	]
})
export class ApmisStoreModule {}
