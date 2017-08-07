import { RouterModule, Routes } from '@angular/router';
import { InventoryManagerComponent } from './inventory-manager.component';
import { StockTakingComponent } from './stock-taking/stock-taking.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';
import { StockHistoryComponent } from './stock-history/stock-history.component';
import { ReceiveStockComponent } from './receive-stock/receive-stock.component';
import { RequisitionComponent } from './requisition/requisition.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LoginEmployeeResolverService } from '../../../resolvers/module-menu/index';

const INVENTORYMODULES_ROUTES: Routes = [
    {
        path: '', component: InventoryManagerComponent, children: [
            { path: '', redirectTo: 'inventory' },
            {
                path: 'inventory', component: LandingpageComponent,
                // resolve: { loginEmployee: LoginEmployeeResolverService }
            },
            { path: 'stock-taking', component: StockTakingComponent },
            { path: 'stock-transfer', component: StockTransferComponent },
            { path: 'stock-history', component: StockHistoryComponent },
            { path: 'receive-stock', component: ReceiveStockComponent, resolve: { loginEmployee: LoginEmployeeResolverService } },
            { path: 'requisition', component: RequisitionComponent },
        ]
    }
];

export const inventoryManagerRoutes = RouterModule.forChild(INVENTORYMODULES_ROUTES);
