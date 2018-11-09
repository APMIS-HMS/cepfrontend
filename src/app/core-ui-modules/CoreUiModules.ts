import {NgModule} from '@angular/core';

import {PagerButtonComponent, AsomDataPagerComponent} from './ui-components/PagerComponent';
import {CommonModule} from '@angular/common';
import {
    AsomModalDialogComponent,
    AsomModalDialogService, AsomModalTrigger,
    SampleComponentForDialog
} from "./ui-components/BaseDialogComponent";
import { MatDialogModule} from "@angular/material";
import {AsomReportViewerComponent} from "./ui-components/AsomReportViewerComponent";
import {CustomReportService} from "./ui-components/ReportGenContracts";
import {DummyReportDataService} from "./ui-components/DummyReportDataService";
import {RestService} from "../feathers/feathers.service";
import {ReportGeneratorService} from "./ui-components/report-generator-service";
import {DateRangePickerModule} from "ng-pick-daterange";
import {ICustomReportService, reportServiceFactory} from "./ui-components/ReportGenContracts";
import {LabReportSummaryComponent} from "./ui-components/LabReportSummaryComponent";
import {DocumentPrinterComponent} from "./ui-components/DocumentPrinterComponent";


@NgModule({
    imports: [CommonModule, MatDialogModule,DateRangePickerModule],
    exports: [AsomDataPagerComponent, AsomModalTrigger, AsomModalDialogComponent,AsomReportViewerComponent],
    declarations: [AsomDataPagerComponent, PagerButtonComponent,AsomReportViewerComponent,DocumentPrinterComponent,
        AsomModalDialogComponent,SampleComponentForDialog, AsomModalTrigger, AsomModalDialogComponent, LabReportSummaryComponent],
    providers: [AsomModalDialogService,
        
        {provide : ReportGeneratorService, useExisting:DummyReportDataService},
        {provide : DummyReportDataService , useClass: DummyReportDataService}
    ],
    entryComponents:[SampleComponentForDialog]
})
export class CoreUiModules {
}


