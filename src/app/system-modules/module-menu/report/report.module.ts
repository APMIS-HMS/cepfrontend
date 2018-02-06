import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared-module/shared.module';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { ChartsModule } from 'ng2-charts'
import { reportRoutes } from './report.routes';
import { ReportComponent } from './report.component';
import { SummaryComponent } from './summary/summary.component';


@NgModule({
    declarations: [
        ReportComponent,
        SummaryComponent
    ],
    exports: [
    ],
    imports: [
        SharedModule,
        MaterialModule,
        reportRoutes,
        ChartsModule
    ],
    providers: []
})
export class ReportModule { }



