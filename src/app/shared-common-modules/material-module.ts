import { NgModule } from '@angular/core';
import { MdDatepickerModule, MdNativeDateModule, MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule,
     MdInputModule, MdOptionModule, MdSelectionModule, MdSelectModule, MdRadioModule } from '@angular/material';
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
        MdRadioModule
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
        MdSelectModule
    ],
    providers: []
})
export class MaterialModule { }



