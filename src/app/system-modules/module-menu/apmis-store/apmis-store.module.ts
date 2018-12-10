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
import {
	StoreService,
	InventoryService,
	ProductTypeService,
	SupplierService,
	PurchaseOrderService
} from 'app/services/facility-manager/setup';
import { ApmisPaginationComponent } from './components/apmis-pagination/apmis-pagination.component';
import { StoreGlobalUtilService } from './store-utils/global-service';
import { ApmisNewStoreComponent } from './store-stores/apmis-new-store/apmis-new-store.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApmisSearchComponent } from './components/apmis-search/apmis-search.component';
import { ProductCongurationComponent } from './apmis-store-product/product-conguration/product-conguration.component';
import { ProductMovementComponent } from './product-movement/product-movement.component';
import { OutboundTransferComponent } from './product-movement/outbound-transfer/outbound-transfer.component';
import { InboundTransferComponent } from './product-movement/inbound-transfer/inbound-transfer.component';
import { ApmisSearchResultComponent } from './components/apmis-search/apmis-search-result/apmis-search-result.component';
import { ProductEntryComponent } from './product-entry/product-entry.component';
import { InitializeStoreComponent } from './product-entry/initialize-store/initialize-store.component';
import { InvoiceEntryComponent } from './product-entry/invoice-entry/invoice-entry.component';
import { PurchaseListComponent } from './product-entry/purchase-list/purchase-list.component';
import { PurchaseOrderComponent } from './product-entry/purchase-order/purchase-order.component';
import { SuppliersComponent } from './product-entry/suppliers/suppliers.component';
import { ProductConfigPopupComponent } from './product-entry/initialize-store/product-config-popup/product-config-popup.component';
import { ConfigProductComponent } from './apmis-store-product/product-conguration/config-product/config-product.component';
import { NewPurchaseListComponent } from './product-entry/purchase-list/new-purchase-list/new-purchase-list.component';
import { PurchaseListDetailsComponent } from './product-entry/purchase-list/purchase-list-details/purchase-list-details.component';
import { NewPurchaseOrderListComponent } from './product-entry/purchase-order/new-purchase-order-list/new-purchase-order-list.component';
import { PurchaseOrderListDetailsComponent } from './product-entry/purchase-order/purchase-order-list-details/purchase-order-list-details.component';
import { ViewInvoiceComponent } from './product-entry/invoice-entry/view-invoice/view-invoice.component';
import { NewSupplierComponent } from './product-entry/suppliers/new-supplier/new-supplier.component';
import { InboundRequisitionComponent } from './product-movement/inbound-requisition/inbound-requisition.component';
import { OutboundRequisitionComponent } from './product-movement/outbound-requisition/outbound-requisition.component';
import { StoreCheckInComponent } from './components/store-check-in/store-check-in.component';
import { ApmisStoreSupplierSearchComponent } from './components/apmis-store-supplier-search/apmis-store-supplier-search.component';
import { ProductExitComponent } from './product-exit/product-exit.component';
import { SalesComponent } from './product-exit/sales/sales.component';
import { RefundComponent } from './product-exit/refund/refund.component';

@NgModule({
	imports: [ CommonModule, ApmisStoreRoutingModule, OnlyMaterialModule, FormsModule, ReactiveFormsModule ],
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
		ProductMovementComponent,
		OutboundTransferComponent,
		InboundTransferComponent,
		ApmisSearchResultComponent,
		ProductEntryComponent,
		InitializeStoreComponent,
		InvoiceEntryComponent,
		PurchaseListComponent,
		PurchaseOrderComponent,
		SuppliersComponent,
		ProductConfigPopupComponent,
		ConfigProductComponent,
		NewPurchaseListComponent,
		PurchaseListDetailsComponent,
		NewPurchaseOrderListComponent,
		PurchaseOrderListDetailsComponent,
		ViewInvoiceComponent,
		NewSupplierComponent,
		InboundRequisitionComponent,
		OutboundRequisitionComponent,
		StoreCheckInComponent,
		ApmisStoreSupplierSearchComponent,
		ProductExitComponent,
		SalesComponent,
		RefundComponent
	],
	providers: [
		StoreService,
		InventoryService,
		StoreGlobalUtilService,
		ProductTypeService,
		SupplierService,
		PurchaseOrderService
	]
})
export class ApmisStoreModule {}
