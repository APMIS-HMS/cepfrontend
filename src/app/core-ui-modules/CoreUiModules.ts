import {NgModule} from '@angular/core';

import {PagerButtonComponent, AsomDataPagerComponent} from './ui-components/PagerComponent';
import {CommonModule} from '@angular/common';

import {DummyReportDataService} from "./ui-components/DummyReportDataService";
import {ReportGeneratorService} from "./ui-components/report-generator-service";
import {DocumentPrinterComponent} from "./ui-components/DocumentPrinterComponent";
import {LabReportDetails, LabReportSummaryComponent} from "./ui-components/LabReportSummaryComponent";

const exportableComponents = [AsomDataPagerComponent, PagerButtonComponent, DocumentPrinterComponent,
    LabReportSummaryComponent, LabReportDetails]

@NgModule({
    imports: [CommonModule/*, MatDialogModule*/],
    exports: [...exportableComponents],
    declarations: [...exportableComponents],

    providers: [

        {provide: ReportGeneratorService, useExisting: DummyReportDataService},
        {provide: DummyReportDataService, useClass: DummyReportDataService}
    ],
    entryComponents: []
})
export class CoreUiModules {
}


