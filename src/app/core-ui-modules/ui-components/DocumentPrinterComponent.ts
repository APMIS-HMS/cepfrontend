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
   

    constructor() {
    }

    ngOnInit() {
        //console.log(this.content);
    }

    printReport() {
        if (this.content) {

            const wnd:Window = window.open('', 'Lab Report', 'width=860px ; height=680px');
            
                //wnd.document.write("It works!!");
                const h1  = wnd.document.createElement('h1');
                const textNode  = document.createTextNode("This a Sample Text Node in h1 Element");
                h1.appendChild(textNode);
               
                wnd.document.body.appendChild(this.content.nativeElement);
                console.log(wnd);
                console.log("Template Reference from Angular",this.content.nativeElement);
        }
        else {
            // print currentPage
            window.print();
        }
    }
}