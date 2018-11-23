import {Component, OnInit} from '@angular/core';
import {PaymentReportGenerator} from "./report-generator-service";
import {IPaymentReportSummaryModel} from "./PaymentReportModel";

@Component({
    selector: 'app-payment-summary-report',
    template: `
        <div>
            <h3>Payment Summary</h3>
            <table class="table">
               
                <tr >
                    <td>
                        <h4>Total Payment from Sales</h4>
                    </td>
                    <td>
                     <h4><sup>NGN</sup> {{summaryData.totalSales | number }}</h4>
                </td>
                    
                </tr>
            </table>
        </div>
    `
})

export class PaymentReportSummaryComponent implements OnInit {
    
    summaryData  : IPaymentReportSummaryModel;
    constructor(private paymentReportService  : PaymentReportGenerator) {
    }

    ngOnInit() {
        
        this.getPaymentSalesSummaryData();
    }
    
    getPaymentSalesSummaryData()
    {
        this.paymentReportService.getPaymentReportSummary()
            .then(x => {
                this.summaryData  =   x.data;
            });
    }
}