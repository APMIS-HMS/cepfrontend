import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './store.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const STOREMODULES_ROUTES: Routes = [
    { path: '', component: StoreComponent, children: [
            { path: '', redirectTo: 'home' },
            { path: 'home', component: LandingPageComponent },
        ]
    }
];

export const storeRoutes = RouterModule.forChild(STOREMODULES_ROUTES);
