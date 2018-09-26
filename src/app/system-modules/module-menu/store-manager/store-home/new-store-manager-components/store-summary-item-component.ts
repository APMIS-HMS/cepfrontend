import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IStoreSummaryItem} from './store-summary-model';

@Component({
    selector: 'store-summary-item',
    template: `
        <div class="item-color-bar" [ngStyle]="{'background-color':item.tagColor}"></div>
        <div  class="store-item">
            <span class="item-key">{{item?.key}}</span>
            <p class="item-value"  (click)="itemDetailsClick($event)">{{item?.value}}</p>
            <span class="details" (click)="itemDetailsClick($event)">See Details...</span>
        </div>
    `,
    styles : [
        `
            span.details {
                color: #008eb4;
                font-size: 10px;
                cursor: pointer;
            }

            p.item-value {
                font-size: 24px;
                margin: 2px;
                cursor: pointer;
            }

            span.item-key {
                font-size: 12px;
            }
            div.item-color-bar
            {
                height : 5px;
                min-width: 200px;
            }

            .store-item {
                padding: 10px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                min-height: 70px;
                min-width: 60px;
                align-items: center;
                background-color: white;
                box-shadow: 1px 2px 9px rgba(79, 79, 79, 0.27);

            }
        `
    ]
})


export class StoreSummaryItemComponent implements OnInit {
    constructor() {
    }
    @Input() item : IStoreSummaryItem;
    @Input() color : string = '';
    @Output() onDetailClick : EventEmitter<IStoreSummaryItem>  =  new EventEmitter<IStoreSummaryItem>();
    ngOnInit() {
    }

    itemDetailsClick(item)
    {
        this.onDetailClick.emit(item);
    }
}