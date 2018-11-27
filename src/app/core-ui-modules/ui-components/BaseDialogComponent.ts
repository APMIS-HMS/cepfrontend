import {Component, OnInit, Injectable, Input, HostListener, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import {PagerButtonComponent} from "./PagerComponent";


@Injectable()
export class AsomModalDialogService {
    constructor(private modalRef: MatDialog) {
    }

    openDialog(component: any, data: any, config: any) {
        const dialogRef = this.modalRef.open(component, {data, ...config});
        dialogRef.afterClosed().subscribe(x => {
            console.log("Dialog Closed!")
        });
        return dialogRef;
    }

    openSimpleModal(data: any, title?: string) {
        const cmp: Component = SampleComponentForDialog;
        data = data || {
            disableClose : false,
            title:"Apmis Modal Dialog Title"
        };
        data.title = title;
        this.openDialog(cmp, data, {
            width: "900px",
            panelClass: "",/*apmis-dialog-override*/
            disableClose: data.disableClose, title: title || "Dialog Title", 
        });
    }
}

@Component({
    selector: 'asom-modal-dialog',
    template: `
        <div class="">
            <h2>Dialog Component Shell</h2>
        </div>`
})

export class AsomModalDialogComponent implements OnInit {
    constructor() {
    }

    ngOnInit() {
    }
}

@Component({
    selector: "asom-modal-trigger",
    template: `
        <span>{{text}}</span>
    `
})
export class AsomModalTrigger {
    @Input() text: string = "Open Dialog";
    @Input() title: string = "Dialog Title Goes here!";
    @Input() disableClose: boolean = false;
    @HostListener('click') onHostClick() {

        this.onClick();
    }

    constructor(private dialogService: AsomModalDialogService) {

    }

    onClick() {
        this.dialogService.openSimpleModal({
            content: {
                buttonText: "+",
                name: "Alfred Obialo"
            },
            disableClose : this.disableClose 
        }, this.title)
    }

}

@Component({
    selector: "sample-dialog",
    template: `
        <div>
            <div class="apmis-mat-dialog-flex-center" >
                <h1 mat-dialog-title class="lead"> {{data?.title || "Dialog Title Not set"}}</h1>
                <span class="apmis-theme-color font-size-override">All Purpose Medical Information System</span>
            </div>
          
                <mat-dialog-content class="font-size-override">
                    <div class="pad20 min-h300">
                        Here is the content for the sample Dialog
                        <br>
                        Data : {{data.content.name}}
                        <br>
                        <asom-pager-button size="large" background-color="orange" [is-oval]="false">
                            <i class="fa fa-plus"></i>
                        </asom-pager-button>
                    </div>

                </mat-dialog-content>
                <div mat-dialog-actions class="">
                    <button class="btn btn-danger " (click)="closeDialog()" >Close Dialog</button>
                    &nbsp;
                    <button class="btn btn-blue" mat-dialog-close >Close Dialog</button>
                </div>
            </div>
     
    `,
    styles: [`
        .font-size-override
        {
            font-size : 13px;
        }
        
        .pad20 {
            padding: 20px;
        }

        .pad30 {
            padding: 30px;
        }

        .pad10 {
            padding: 10px;
        }

        .min-h500 {
            min-height: 500px;
        }.min-h300 {
             min-height: 300px;
         }
    `]
})
export class SampleComponentForDialog implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SampleComponentForDialog>) {

    }

    ngOnInit() {
        console.log(this.data);
    }

    closeDialog() {
        // check the state before closing
        this.dialogRef.close();
    }
}

@Component({
    selector: "sample-dialog",
    template: `
        <div>
            <div class="apmis-mat-dialog-flex-center" >
                <h1 mat-dialog-title class="lead"> {{data?.title || "Dialog Title Not set"}}</h1>
            </div>
          
                <mat-dialog-content class="font-size-override">
                    <div class="pad20 min-h300">
                      
                    </div>

                </mat-dialog-content>
                <div mat-dialog-actions class="">
                    <button class="btn btn-danger " (click)="closeDialog()" >{{data?.buttons?.ok || "Cancel"}}</button>
                    &nbsp;
                    <button class="btn btn-blue" mat-dialog-close >{{data?.buttons?.ok || "Ok"}}</button>
                </div>
            </div>
     
    `,
    styles: [`
        .font-size-override
        {
            font-size : 13px;
        }
        
        .pad20 {
            padding: 20px;
        }

        .pad30 {
            padding: 30px;
        }

        .pad10 {
            padding: 10px;
        }

        .min-h500 {
            min-height: 500px;
        }.min-h300 {
             min-height: 300px;
         }
    `]
})
export class HmoBenerficiaryDialog implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<HmoBenerficiaryDialog>) {

    }

    ngOnInit() {
       
    }

    closeDialog() {
        // check the state before closing
        this.dialogRef.close();
    }
}