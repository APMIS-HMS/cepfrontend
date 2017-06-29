import { NgModule } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { MdDatepickerModule, MdNativeDateModule, MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule, MdInputModule, MdOptionModule} from '@angular/material';
@NgModule({
    declarations: [],
    exports: [
        MdNativeDateModule, MdDatepickerModule, MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule, MdInputModule, MdOptionModule
    ],
    imports: [
        MdNativeDateModule, MdDatepickerModule, MdButtonModule, MdCheckboxModule, MdProgressSpinnerModule, MdInputModule, MdOptionModule
    ],
    providers: []
})
export class MaterialModule { }



