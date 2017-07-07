import { NgModule } from '@angular/core';
import { MdDatepickerModule, MdNativeDateModule, MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule,
     MdInputModule, MdOptionModule, MdSelectionModule, MdSelectModule, MdRadioModule, MdTabsModule } from '@angular/material';
@NgModule({
    declarations: [],
    exports: [
        MdNativeDateModule,
        MdDatepickerModule,
        MdButtonModule,
        MdCheckboxModule,
        MdProgressSpinnerModule,
        MdInputModule,
        MdOptionModule,
        MdSelectionModule,
        MdSelectModule,
        MdRadioModule,
        MdTabsModule
    ],
    imports: [
        MdNativeDateModule,
        MdDatepickerModule,
        MdButtonModule,
        MdRadioModule,
        MdCheckboxModule,
        MdProgressSpinnerModule,
        MdInputModule,
        MdOptionModule,
        MdSelectionModule,
        MdSelectModule,
        MdRadioModule,
        MdTabsModule
    ],
    providers: []
})
export class MaterialModule { }



