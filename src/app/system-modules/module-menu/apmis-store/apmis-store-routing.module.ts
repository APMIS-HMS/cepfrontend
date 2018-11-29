import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApmisStoreHomeComponent } from './apmis-store-home/apmis-store-home.component';
import { ApmisStoreLandingpageComponent } from './apmis-store-landingpage.component';
import { ApmisStoreProductComponent } from './apmis-store-product/apmis-store-product.component';
import { StoreStoresComponent } from './store-stores/store-stores.component';
import { ApmisNewStoreComponent } from './store-stores/apmis-new-store/apmis-new-store.component';
import { ProductEntryComponent } from './product-entry/product-entry.component';
const routes: Routes = [
	{
		path: '',
		component: ApmisStoreLandingpageComponent,
		children: [
			{
				path: '',
				component: ApmisStoreHomeComponent
			},
			{
				path: 'home',
				component: ApmisStoreHomeComponent
			},
			{
				path: 'store',
				component: StoreStoresComponent
      		},
      		{
        		path: "new-store",
        		component: ApmisNewStoreComponent
      		},
			{
				path: 'product',
				component: ApmisStoreProductComponent
			},
			{
				path: 'productEntry',
				component: ProductEntryComponent
			}
		]
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class ApmisStoreRoutingModule {}
