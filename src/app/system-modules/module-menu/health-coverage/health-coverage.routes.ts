import { RouterModule, Routes } from '@angular/router';
import { CompanyCoverComponent } from './company-cover/company-cover.component';
import { FamilyCoverComponent } from './family-cover/family-cover.component';
import { HmoCoverComponent } from './hmo-cover/hmo-cover.component';
import { CoverPaymentComponent } from './cover-payment/cover-payment.component';
import { HealthCoverageComponent } from './health-coverage.component';

const HEALTHCOVERMODULES_ROUTES: Routes = [
    {
        path: '', component: HealthCoverageComponent, children: [
            { path: '', redirectTo: 'hmo-cover' },
            { path: 'company-cover', component: CompanyCoverComponent },
            { path: 'family-cover', component: FamilyCoverComponent },
             { path: 'hmo-cover', component: HmoCoverComponent },
            { path: 'payment', component: CoverPaymentComponent },
        ]
    }
];

export const healthCoverRoutes = RouterModule.forChild(HEALTHCOVERMODULES_ROUTES);