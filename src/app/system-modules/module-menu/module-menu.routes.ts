import { RouterModule, Routes } from '@angular/router';
import { ModuleMenuComponent } from './module-menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const MODULEMENU_ROUTES: Routes = [
    {
        path: '', component: ModuleMenuComponent, children: [
            { path: '', redirectTo: 'dashboard' },
            { path: 'dashboard', component: DashboardComponent },
            {
                path: 'setup',
                loadChildren: './facility-page/facility-page.module#FacilityPageModule'
            },
            {
                path: 'employee-manager',
                loadChildren: './employee-manager/employee-manager.module#EmployeeManagerModule'
            },
            {
                path: 'employee-manager/:id',
                loadChildren: './employee-manager/employee-manager.module#EmployeeManagerModule'
            },
            {
                path: 'access-manager', loadChildren: './access-manager/access-manager.module#AccessManagerModule'
            },
            {
                path: 'patient-manager',
                loadChildren: './patient-manager/patient-manager.module#PatientManagerModule'
            },
            {
                path: 'patient-manager/:id',
                loadChildren: './patient-manager/patient-manager.module#PatientManagerModule'
            },
            {
                path: 'ward-manager',
                loadChildren: './ward-manager/ward-manager.module#WardManagerModule'
            },
            {
                path: 'health-coverage',
                loadChildren: './health-coverage/health-coverage.module#HealthCoverageModule'
            },
            {
                path: 'billing',
                loadChildren: './billing/billing.module#BillingModule'
            },
            {
                path: 'payment',
                loadChildren: './payment/payment.module#PaymentModule'
            },
            {
                path: 'wallet',
                loadChildren: './wallet/wallet.module#WalletModule'
            },
            {
                path: 'clinic',
                loadChildren: './clinic/clinic.module#ClinicModule'
            },
            {
                path: 'forms-manager',
                loadChildren: './forms-manager/forms-manager.module#FormsManagerModule'
            },
            {
                path: 'store',
                loadChildren: './store-manager/store.module#StoreModule'
            },
            {
                path: 'product-manager',
                loadChildren: './product-manager/product-manager.module#ProductManagerModule'
            },
             {
                path: 'purchase-manager',
                loadChildren: './purchase-manager/purchase-manager.module#PurchaseManagerModule'
            },
            {
                path: 'inventory-manager',
                loadChildren: './inventory-manager/inventory-manager.module#InventoryManagerModule'
            },
            {
                path: 'pharmacy',
                loadChildren: './pharmacy/pharmacy-manager.module#PharmacyManagerModule'
            }

        ],

    }


];

export const moduleMenuRoutes = RouterModule.forChild(MODULEMENU_ROUTES);
