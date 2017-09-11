import { FacilityCompanyCoverService } from './../../../services/facility-manager/setup/facility-company-cover.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { healthCoverRoutes } from './health-coverage.routes';

import { HealthCoverageComponent } from './health-coverage.component';
import { CompanyCoverComponent } from './company-cover/company-cover.component';
import { PersonDependantsComponent } from './person-dependants/person-dependants.component';
import { FamilyCoverComponent } from './family-cover/family-cover.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AddPrincipalComponent } from './add-principal/add-principal.component';
import { HmoCoverComponent } from './hmo-cover/hmo-cover.component';
import { StaffCoverComponent } from './staff-cover/staff-cover.component';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { HmoListComponent } from './hmo-cover/hmo-list/hmo-list.component';
import { BeneficiaryListComponent } from './hmo-cover/beneficiary-list/beneficiary-list.component';
import { CoverPaymentComponent } from './cover-payment/cover-payment.component';
import { CoverBillComponent } from './cover-payment/cover-bill/cover-bill.component';
import { CoverListComponent } from './cover-payment/cover-list/cover-list.component';
import { CompanyListComponent } from './cover-payment/company-list/company-list.component';
import { CompanyBillComponent } from './cover-payment/company-bill/company-bill.component';
import { FamilyBillComponent } from './cover-payment/family-bill/family-bill.component';
import { FamilyListComponent } from './cover-payment/family-list/family-list.component';
import { HmoService } from './../../../services/facility-manager/setup/index';
import { CompanyBeneficiaryListComponent } from './company-cover/company-beneficiary-list/company-beneficiary-list.component';
import { CcListComponent } from './company-cover/cc-list/cc-list.component';
import { FcListComponent } from './family-cover/fc-list/fc-list.component';
import { FcBeneficiaryListComponent } from './family-cover/fc-beneficiary-list/fc-beneficiary-list.component';
import { BillAddItemComponent } from './bill-add-item/bill-add-item.component';
import { BillAddModefierComponent } from './bill-add-modefier/bill-add-modefier.component';
import { BillAddLineModefierComponent } from './bill-add-line-modefier/bill-add-line-modefier.component';
import { RecievePaymentComponent } from './recieve-payment/recieve-payment.component';
@NgModule({
    declarations: [
        CompanyCoverComponent,
        PersonDependantsComponent,
        HealthCoverageComponent,
        FamilyCoverComponent,
        AddEmployeeComponent,
        AddPrincipalComponent,
        HmoCoverComponent,
        StaffCoverComponent,
        HmoListComponent,
        BeneficiaryListComponent,
        CoverPaymentComponent,
        CoverBillComponent,
        CoverListComponent,
        CompanyListComponent,
        CompanyBillComponent,
        FamilyBillComponent,
        FamilyListComponent,
        CompanyBeneficiaryListComponent,
        CcListComponent,
        FcListComponent,
        FcBeneficiaryListComponent,
        BillAddItemComponent,
        BillAddModefierComponent,
        BillAddLineModefierComponent,
        RecievePaymentComponent
    ],
    exports: [
    ],
    imports: [
        MaterialModule,
        healthCoverRoutes
    ],
    providers: [HmoService, FacilityCompanyCoverService]
})
export class HealthCoverageModule { }



