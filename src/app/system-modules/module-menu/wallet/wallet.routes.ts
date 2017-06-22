import { RouterModule, Routes } from '@angular/router';
import {WalletHomeComponent } from './wallet-home/wallet-home.component';
import {WalletComponent } from './wallet.component';

const WALLETMODULES_ROUTES: Routes = [
    {
        path: '', component: WalletHomeComponent, children: [
            { path: '', redirectTo: 'wallet' },
            { path: 'wallet', component: WalletComponent },
        ]
    }
];

export const walletRoutes = RouterModule.forChild(WALLETMODULES_ROUTES);
