import {NgModule} from '@angular/core';

import {PagerButtonComponent, AsomDataPagerComponent} from './ui-components/PagerComponent';
import {CommonModule} from '@angular/common';

import {DummyPaymentReportService, DummyReportDataService} from "./ui-components/DummyReportDataService";
import {PaymentReportGenerator, ReportGeneratorService} from "./ui-components/report-generator-service";
import {DocumentPrinterComponent} from "./ui-components/DocumentPrinterComponent";
import {LabReportDetails, LabReportSummaryComponent} from "./ui-components/LabReportSummaryComponent";
import {InvoicePaymentReportComponent} from "./ui-components/InvoicePaymentReportComponent";

const exportableComponents = [AsomDataPagerComponent, PagerButtonComponent, DocumentPrinterComponent,
    LabReportSummaryComponent, LabReportDetails, InvoicePaymentReportComponent]

@NgModule({
    imports: [CommonModule/*, MatDialogModule*/],
    exports: [...exportableComponents],
    declarations: [...exportableComponents],

    providers: [
        {provide: ReportGeneratorService, useExisting: DummyReportDataService},
        {provide: DummyReportDataService, useClass: DummyReportDataService},
        {provide: PaymentReportGenerator, useExisting: DummyPaymentReportService},
        {provide: DummyPaymentReportService, useClass: DummyPaymentReportService},
    ],
    entryComponents: []
})
export class CoreUiModules {
}


