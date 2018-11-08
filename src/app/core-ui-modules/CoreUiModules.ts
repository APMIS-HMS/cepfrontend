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
import {CustomReportService, ICustomReportService, reportServiceFactory} from "./ui-components/LabReportModel";
import {DummyReportDataService} from "./ui-components/DummyReportDataService";


@NgModule({
    imports: [CommonModule, MatDialogModule],
    exports: [AsomDataPagerComponent, AsomModalTrigger, AsomModalDialogComponent,AsomReportViewerComponent],
    declarations: [AsomDataPagerComponent, PagerButtonComponent,AsomReportViewerComponent,
        AsomModalDialogComponent,SampleComponentForDialog, AsomModalTrigger, AsomModalDialogComponent],
    providers: [AsomModalDialogService, DummyReportDataService],
    entryComponents:[SampleComponentForDialog]
})
export class CoreUiModules {
}


