import { NgModule } from '@angular/core';
import {
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatError,
    MatDatepickerToggle,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatTabsModule,
    MatListModule,
    MatSelectBase,
    MatSelectModule,
    MatRadioModule,
    MatPaginatorModule,
    MatDialogModule
}
    from '@angular/material';

@NgModule({
    declarations: [ ],
    imports: [
        MatNativeDateModule,
        MatDatepickerModule,
        MatButtonModule,
        MatRadioModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatAutocompleteModule,
        MatOptionModule,
        MatPaginatorModule,
        MatSelectModule,
        MatListModule,
        MatRadioModule,
        MatTabsModule,
        MatDialogModule
       
    ],
    exports: [
        MatNativeDateModule,
        MatDatepickerModule,
        MatButtonModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatAutocompleteModule,
        MatOptionModule,
        MatDatepickerToggle,
        MatPaginatorModule,
        MatSelectModule,
        MatRadioModule,
        MatListModule,
        MatTabsModule,
        MatDialogModule
    ],
    providers: []
})
export class OnlyMaterialModule { }



