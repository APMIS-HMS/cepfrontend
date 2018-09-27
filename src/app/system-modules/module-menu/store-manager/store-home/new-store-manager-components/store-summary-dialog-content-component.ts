import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'store-summary-dialog',
    templateUrl: 'store-summary-dialog-content.component.html'
})

export class StoreSummaryDialogComponent implements OnInit {
    @Input('title') dialogTitle : string ;
    @Output() onActionSuccess  : EventEmitter<any>  =  new EventEmitter<any>();
    @Output() onClose: EventEmitter<boolean> =  new EventEmitter<boolean>();
    constructor() {
    }

    ngOnInit() {
    }
    closeDialogClick()
    {
        this.onClose.emit(true);
    }
}