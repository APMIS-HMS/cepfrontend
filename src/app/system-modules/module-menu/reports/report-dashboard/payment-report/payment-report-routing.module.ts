import { Routes, RouterModule } from '@angular/router';
import { PaymentReportComponent } from './payment-report.component';
import { PaymentSummaryPageComponent } from './payment-summary-page/payment-summary-page.component';
import { InvoiceListDetailsComponent } from './invoice-list-details/invoice-list-details.component';




const PAYMENT_REPORT_ROUTE: Routes = [
	{
		path: '',
		component: PaymentSummaryPageComponent,
		children: [
			{ path: 'paymentSummary', component: PaymentSummaryPageComponent},
			{ path: 'invoiceList', component: InvoiceListDetailsComponent}
		]
	}
];
export const PaymentReportRoutingModule = RouterModule.forChild(PAYMENT_REPORT_ROUTE);