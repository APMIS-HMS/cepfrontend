import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PaymentReportGenerator} from "../../../../../../core-ui-modules/ui-components/report-generator-service";
import {
    IPaymentReportModel,
    IPaymentReportOptions,
    IPaymentReportSummaryModel
} from "../../../../../../core-ui-modules/ui-components/PaymentReportModel";
import {IDateRange} from "ng-pick-daterange";
import {IApiResponse} from "../../../../../../core-ui-modules/ui-components/ReportGenContracts";

@Component({
    selector: 'app-invoice-list-details',
    templateUrl: './invoice-list-details.component.html',
    styleUrls: ['./invoice-list-details.component.scss']
})
export class InvoiceListDetailsComponent implements OnInit {


    apiResponse: IApiResponse<IPaymentReportModel[]> = {data : []};
 
    reportOptions: IPaymentReportOptions = {
        isSummary: false, filterByDate: false,
        startDate: new Date(),
        endDate: new Date(),
        paginate: true,
        paginationOptions: {
            skip: 0,
            limit: 20
        }


    };
    paymentSummary = false;

    invoiceA = false;
    invoiceB = false;
    invoiceC = false;
    invoiceD = false;
    invoiceE = false;

    constructor(private _router: Router, private paymentReportService: PaymentReportGenerator) {
    }

    ngOnInit() {
        this.getPaymentReport();
    }

    getPaymentReport() {
        this.paymentReportService.getInvoicePaymentReport(this.reportOptions)
            .then(x => {
                this.apiResponse = x;
                console.log(this.apiResponse,  "API Response");
            })
    }

    showInvoiceA() {
        this.invoiceA = !this.invoiceA;
        this.invoiceB = false;
        this.invoiceC = false;
        this.invoiceD = false;
        this.invoiceE = false;
    }

    showInvoiceB() {
        this.invoiceB = !this.invoiceB;
        this.invoiceA = false;
        this.invoiceC = false;
        this.invoiceD = false;
        this.invoiceE = false;
    }

    showInvoiceC() {
        this.invoiceC = !this.invoiceC;
        this.invoiceA = false;
        this.invoiceB = false;
        this.invoiceD = false;
        this.invoiceE = false;
    }

    showInvoiceD() {
        this.invoiceD = !this.invoiceD;
        this.invoiceA = false;
        this.invoiceB = false;
        this.invoiceC = false;
        this.invoiceE = false;
    }

    showInvoiceE() {
        this.invoiceE = !this.invoiceE;
        this.invoiceA = false;
        this.invoiceB = false;
        this.invoiceC = false;
        this.invoiceD = false;
    }

    assignDate(date: IDateRange) {
        this.reportOptions.startDate = date.from;
        this.reportOptions.endDate = date.to;
        /* console.log("Parent Component Option: ", this.reportOptions);
         this.labRptComponentRef.getReportData();*/
    }
}
