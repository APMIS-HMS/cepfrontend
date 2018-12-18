import {Component, Input, OnInit,OnChanges,SimpleChanges, ViewEncapsulation} from '@angular/core';
import {StoreOutboundModel} from "../ProductGridModel";
import * as _ from 'lodash';
@Component({
    selector: 'store-line',
    templateUrl: './store-line.component.html',
    encapsulation : ViewEncapsulation.None
})

export class StoreLineComponent implements OnInit, OnChanges {
    @Input() data : any;
    totalItems = 0;
    totalAmount = 0;            
    constructor() {
    }

    ngOnInit() {
        console.log(this.data);
    }
    ngOnChanges (changes: SimpleChanges)
    {
        if(changes['data'] != null)
        {
            this.totalAmount = _.sumBy(this.data.products, x => {
                return x.qtyToSend * x.price;
            });
            this.totalItems = this.data.products.length;
        }
        
    }
}