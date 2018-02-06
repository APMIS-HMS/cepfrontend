import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report.component';
import { SummaryComponent } from './summary/summary.component';

const REPORTMODULES_ROUTES: Routes = [
    { path: '', component: ReportComponent,
        children : [
            {path : 'summary',  component : SummaryComponent },
            {path : '', redirectTo : 'summary', pathMatch: 'full' }
        ]
    }
];

export const reportRoutes = RouterModule.forChild(REPORTMODULES_ROUTES);
