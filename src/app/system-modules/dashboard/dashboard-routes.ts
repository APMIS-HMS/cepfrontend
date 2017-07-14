import { PreloadAllModules, Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home.component';
import * as SetupService from '../../services/facility-manager/setup/index';

const appRoutes: Routes = [
    {
        path: '', component: DashboardHomeComponent, children: [
            {
                path: '', component: DashboardComponent
            },
            {
                path: 'facility',
                loadChildren: '../module-menu/facility-page/facility-page.module.ts#FacilityPageModule',
            },
            {
                path: 'employee-manager',
                loadChildren: '../module-menu/employee-manager/employee-manager.module#EmployeeManagerModule',
            },
            {
                path: 'employee-manager/:id',
                loadChildren: '../module-menu/employee-manager/employee-manager.module#EmployeeManagerModule',
            },
            {
                path: 'access-manager',
                loadChildren: '../module-menu/access-manager/access-manager.module#AccessManagerModule'
            },
            {
                path: 'patient-manager',
                loadChildren: '../module-menu/patient-manager/patient-manager.module#PatientManagerModule',
            },
            {
                path: 'patient-manager/:id',
                loadChildren: '../module-menu/patient-manager/patient-manager.module#PatientManagerModule',
            },
            {
                path: 'ward-manager',
                loadChildren: '../module-menu/ward-manager/ward-manager.module#WardManagerModule',
            },
            {
                path: 'health-coverage',
                loadChildren: '../module-menu/health-coverage/health-coverage.module#HealthCoverageModule',
                canActivate: [
                    SetupService.CanActivateViaAuthGuardService
                ]
            },
            {
                path: 'billing',
                loadChildren: '../module-menu/billing/billing.module#BillingModule',
                canActivate: [
                    SetupService.CanActivateViaAuthGuardService
                ]
            },
            {
                path: 'payment',
                loadChildren: '../module-menu/payment/payment.module#PaymentModule'
            },
            {
                path: 'wallet',
                loadChildren: '../module-menu/wallet/wallet.module#WalletModule'
            },
            {
                path: 'clinic',
                loadChildren: '../module-menu/clinic/clinic.module#ClinicModule'
            },
            {
                path: 'forms-manager',
                loadChildren: '../module-menu/forms-manager/forms-manager.module#FormsManagerModule'
            },
            {
                path: 'store',
                loadChildren: '../module-menu/store-manager/store.module#StoreModule'
            },
            {
                path: 'product-manager',
                loadChildren: '../module-menu/product-manager/product-manager.module#ProductManagerModule'
            },
            {
                path: 'purchase-manager',
                loadChildren: '../module-menu/purchase-manager/purchase-manager.module#PurchaseManagerModule'
            },
            {
                path: 'inventory-manager',
                loadChildren: '../module-menu/inventory-manager/inventory-manager.module#InventoryManagerModule'
            },
            {
                path: 'pharmacy',
                loadChildren: '../module-menu/pharmacy/pharmacy-manager.module#PharmacyManagerModule'
            },
              {
                path: 'laboratory',
                loadChildren: '../module-menu/laboratory/laboratory.module#LaboratoryModule'
            },
            {
                path: 'corporate',
                loadChildren: '../corporate-account/corporate-account.module#CorporateAccountModule',
                data: { preload: false },
            },
        ]
    }
];

// export default RouterModule.forRoot(appRoutes);
export const Routing = RouterModule.forChild(appRoutes);
