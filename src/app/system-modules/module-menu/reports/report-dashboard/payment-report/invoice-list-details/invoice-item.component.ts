import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Payment} from "../../../../../../core-ui-modules/ui-components/PaymentReportModel";

@Component({
    
    selector: 'app-invoice-item',
    templateUrl: "./invoice-item.component.html",
    styles: [
        `
            .pad10 {
                padding: 10px;
            }

        `
    ]
})
export class InvoiceItemComponent implements OnInit {
    loading : boolean  =  false;
    
    @Output() onItemsSelected: EventEmitter<Payment> = new EventEmitter<Payment>();
    @Input() InvoiceItems: Payment[] = [];
   

    constructor() {
    }

    ngOnInit() {
    }

  
}
