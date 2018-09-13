import { RadiologyInvestigationServiceComponent } from './radiology-investigation-service/radiology-investigation-service.component';
import { RouterModule, Routes } from '@angular/router';
import { RadiologyComponent } from './radiology.component';
// import { LabRequestsComponent } from './lab-requests/lab-requests.component';
import { RadiologyInvestigationPriceComponent } from './radiology-investigation-price/radiology-investigation-price.component';
import { PanelComponent } from './panel/panel.component';
import { ReportComponent } from './report/report.component';
import { ExternalInvestigationsComponent } from './external-investigations/external-investigations.component';
import { TemplateComponent } from './template/template.component';

const RADIOLOGYMODULES_ROUTES: Routes = [
    {
        path: '', component: RadiologyComponent
        , children: [
            { path: '', redirectTo: 'requests' },
            // { path: 'requests', component: LabRequestsComponent },
            // { path: 'request/:id', component: LabRequestsComponent },
            { path: 'investigations', component: RadiologyInvestigationServiceComponent },
            { path: 'investigation-pricing', component: RadiologyInvestigationPriceComponent },
            { path: 'panels', component: PanelComponent },
            { path: 'external-requests', component: ExternalInvestigationsComponent },
            { path: 'reports', component: ReportComponent },
            { path: 'report/:requestId/:investigationId', component: ReportComponent },
            { path: 'templates', component: TemplateComponent }
        ]
    }
];

export const radiologyRoutes = RouterModule.forChild(RADIOLOGYMODULES_ROUTES);
