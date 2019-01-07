import { NgModule } from '@angular/core';

// import {PrescribedTableComponent} from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/new-patient-prescription/prescribed-table/prescribed-table.component';
// import {PrescriptionBillComponent} from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/new-patient-prescription/prescription-bill/prescription-bill.component';
// import {GenBillSearchComponent} from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/new-patient-prescription/prescription-bill/gen-bill-search/gen-bill-search.component';

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
    MatDialogModule,
    MatButtonToggleModule,
    MatTooltipModule
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
        MatDialogModule,
        MatButtonToggleModule,
        MatTooltipModule
       
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
        MatDialogModule,
        MatButtonToggleModule,
        MatTooltipModule
        // PrescribedTableComponent,
        // PrescriptionBillComponent,
        // GenBillSearchComponent
    ],
    providers: []
})
export class OnlyMaterialModule { }



