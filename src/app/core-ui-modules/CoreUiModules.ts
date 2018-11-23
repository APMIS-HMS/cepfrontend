import {NgModule} from '@angular/core';

import {PagerButtonComponent, AsomDataPagerComponent} from './ui-components/PagerComponent';
import {CommonModule} from '@angular/common';
import {
    AsomModalDialogComponent,
    AsomModalDialogService, AsomModalTrigger,
    SampleComponentForDialog
} from "./ui-components/BaseDialogComponent";
import { MatDialogModule} from "@angular/material";

@NgModule({
    imports: [CommonModule, MatDialogModule],
    exports: [AsomDataPagerComponent, AsomModalTrigger, AsomModalDialogComponent],
    declarations: [AsomDataPagerComponent, PagerButtonComponent,
        AsomModalDialogComponent,SampleComponentForDialog, AsomModalTrigger, AsomModalDialogComponent],
    providers: [AsomModalDialogService],
    entryComponents:[SampleComponentForDialog]
})
export class CoreUiModules {
}


