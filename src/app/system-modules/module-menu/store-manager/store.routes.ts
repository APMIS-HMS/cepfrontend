import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './store.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { StoreHomeComponent } from './store-home/store-home.component';
import { PosComponent } from './pos/pos.component';

const STOREMODULES_ROUTES: Routes = [
    { path: '', component: StoreComponent, children: [
            { path: '', redirectTo: 'store' },
            { path: 'store', component: StoreHomeComponent },
            { path: 'pos', component: PosComponent },
            { path: 'view-store', component: LandingPageComponent },
        ]
    }
];

export const storeRoutes = RouterModule.forChild(STOREMODULES_ROUTES);
