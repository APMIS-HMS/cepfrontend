import { NgModule } from '@angular/core';
import { MdDatepickerModule, MdNativeDateModule, MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule,
     MdInputModule, MdAutocompleteModule, MdOptionModule, MdTabsModule, MdSelectionModule, MdSelectModule, MdRadioModule } from '@angular/material';
@NgModule({
    declarations: [],
    exports: [
        MdNativeDateModule,
        MdDatepickerModule,
        MdButtonModule,
        MdCheckboxModule,
        MdProgressSpinnerModule,
        MdInputModule,
        MdAutocompleteModule,
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
        MdAutocompleteModule,
        MdOptionModule,
        MdSelectionModule,
        MdSelectModule,
        MdRadioModule,
        MdTabsModule
    ],
    providers: []
})
export class MaterialModule { }



