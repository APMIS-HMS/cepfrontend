import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'apmis-search-button',
    template: ` <asom-pager-button [background-color]="color" (onClick)="search()"
                                   [is-disable]="processing" [is-oval]="true"

    ><span class="fa fa-search fa-2x"></span></asom-pager-button>`
})
export class SearchButtonComponent implements OnInit {
    @Input() color : string  = 'blue';
    @Input() processing : boolean  = false;
    @Output() onSearch : EventEmitter<void>  =  new EventEmitter<void>();
    constructor() {
    }

    ngOnInit() {
    }
    search()
    {
        this.onSearch.emit();
    }
}