import { NgModule } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { MdDatepickerModule,MdSelectModule, MdNativeDateModule, MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule, MdInputModule, MdOptionModule} from '@angular/material';
@NgModule({
    declarations: [],
    exports: [
        MdNativeDateModule,MdSelectModule, MdDatepickerModule, MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule, MdInputModule, MdOptionModule
    ],
    imports: [
        MdNativeDateModule,MdSelectModule, MdDatepickerModule, MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule, MdInputModule, MdOptionModule
    ],
    providers: []
})
export class MaterialModule { }



