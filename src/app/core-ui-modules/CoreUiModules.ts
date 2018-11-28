import {NgModule} from '@angular/core';

import {PagerButtonComponent, AsomDataPagerComponent} from './ui-components/PagerComponent';
import {CommonModule} from '@angular/common';

import {
    DummyPaymentChartDataService,
    DummyPaymentReportService,
    DummyReportDataService
} from "./ui-components/DummyReportDataService";
import {
    PaymentChartDataService,
    PaymentReportGenerator,
    ReportGeneratorService
} from "./ui-components/report-generator-service";
import {DocumentPrinterComponent} from "./ui-components/DocumentPrinterComponent";
import {LabReportDetails, LabReportSummaryComponent} from "./ui-components/LabReportSummaryComponent";
import {NairaCurrencySymbolComponent} from "./ui-components/NairaCurrencySymbolComponent";


const exportableComponents = [AsomDataPagerComponent, PagerButtonComponent, DocumentPrinterComponent,
    LabReportSummaryComponent, LabReportDetails,NairaCurrencySymbolComponent]

@NgModule({
    imports: [CommonModule/*, MatDialogModule*/],
    exports: [...exportableComponents],
    declarations: [...exportableComponents],

    providers: [
        PaymentReportGenerator , /*PaymentChartDataService,*/ DummyPaymentChartDataService,
        {provide: ReportGeneratorService, useClass: ReportGeneratorService},
        {provide: DummyReportDataService, useClass: DummyReportDataService},
        //{provide: PaymentReportGenerator, useExisting: DummyPaymentReportService},
        {provide: PaymentChartDataService, useExisting: DummyPaymentChartDataService},
        {provide: DummyPaymentReportService, useClass: DummyPaymentReportService},
    ],
    entryComponents: []
})
export class CoreUiModules {
}


