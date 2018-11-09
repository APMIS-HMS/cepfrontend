import {Component, Input, OnInit, ElementRef} from '@angular/core';

@Component({
    selector: 'app-document-printer',
    template: `
        <asom-pager-button [is-oval]="true" (onClick)="printReport()">
            <span class="fa fa-print fa-2x"></span>
        </asom-pager-button>
    `
})

export class DocumentPrinterComponent implements OnInit {
    @Input() content: ElementRef;
    private wnd: Window;

    constructor() {
    }

    ngOnInit() {
        //console.log(this.content);
    }

    printReport() {
        if (this.content) {

            this.wnd = window.open('', 'Lab Report', 'width=860px ; height=680px');
            const body  = this.wnd.document.createElement('body');
            this.wnd.document.appendChild(body);
                body.appendChild(this.content.nativeElement);
            console.log(this.content);
        }
        else {
            // print currentPage
            window.print();
        }
    }
}