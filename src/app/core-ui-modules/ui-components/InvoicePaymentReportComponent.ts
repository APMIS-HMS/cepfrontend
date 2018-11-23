import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {IPaymentReportModel, IPaymentReportOptions} from "./PaymentReportModel";
import {PaymentReportGenerator} from "./report-generator-service";
import {IPagerSource} from "./PagerComponent";

@Component({
    exportAs: 'PRG',
    selector: 'app-invoice-payment-report',
    template: `
        <div class="pad10">
            <h1>Invoice Payment Report Details</h1>
            <hr>
            <div>
                <h1>
                    {{reportData.length| number}} Record Found
                    
                </h1>
            </div>

            <div>
                <asom-data-pager [show-progress]="true" [in-progress]="loading"
                                 (onPageClick)="gotoPage($event)"
                                 [pager-source]="pagerSource"

                ></asom-data-pager>
            </div>
        </div>

    `,
    styles: [
            `
            .pad10 {
                padding: 10px;
            }

        `
    ]
})

export class InvoicePaymentReportComponent implements OnInit {
    loading : boolean  =  false;
    @Input() reportOptions: IPaymentReportOptions;
    @Output() onItemsSelected: EventEmitter<IPaymentReportModel> = new EventEmitter<IPaymentReportModel>();
    reportData: IPaymentReportModel[] = [];
    pagerSource: IPagerSource = {totalRecord: 0, pageSize: 20, currentPage: 0, totalPages: 0};

    constructor(private reportService: PaymentReportGenerator) {
    }

    ngOnInit() {
    }

    getReport(rptOpt: IPaymentReportOptions) {
        this.loading  = true;
        this.reportService.getInvoicePaymentReport(rptOpt)
            .then(x => {
                this.loading  = false;
                console.log(x.data);
                this.reportData  = x.data;
            }, x =>{
                this.loading   = false;
            });
    }
    
    
    gotoPage (index  : number)
    {
        this.pagerSource.currentPage   = index;
        this.reportOptions.paginationOptions.skip= index;
    }
}