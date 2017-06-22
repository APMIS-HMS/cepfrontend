import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { PaymentComponent } from './payment.component';
import { paymentRoutes } from './payment.routes';
import { PaymentHomeComponent } from './payment-home/payment-home.component';
import { AddModefierComponent } from './add-modefier/add-modefier.component';
import { AddItemComponent } from './add-item/add-item.component';
import { AddLineModifierComponent } from './add-line-modifier/add-line-modifier.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { BillLookupComponent } from './bill-lookup/bill-lookup.component';
import { BillGroupComponent } from './bill-lookup/bill-group/bill-group.component';


@NgModule({
    declarations: [
        PaymentHomeComponent,
        PaymentComponent,
        PaymentHomeComponent,
        AddModefierComponent,
        AddItemComponent,
        AddLineModifierComponent,
        ItemDetailComponent,
        InvoiceComponent,
        BillLookupComponent,
        BillGroupComponent,
    ],

    exports: [
    ],
    imports: [
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        paymentRoutes
    ],
    providers: []
})
export class PaymentModule { }



