import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApmisStoreHomeComponent } from './apmis-store-home/apmis-store-home.component';
import { ApmisStoreLandingpageComponent } from './apmis-store-landingpage.component';
import { StoreStoresComponent } from './store-stores/store-stores.component';
import { ApmisStoreProductComponent } from './apmis-store-product/apmis-store-product.component';


const routes: Routes = [
  {
    path: "",
    component: ApmisStoreLandingpageComponent,
    children: [
      {
        path: "",
        component: ApmisStoreHomeComponent
      },
      {
        path: "home",
        component: ApmisStoreHomeComponent
      },
      {
        path: "store",
        component: StoreStoresComponent
      }
        path: "product",
        component: ApmisStoreProductComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApmisStoreRoutingModule { }
