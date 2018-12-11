import {Component, Input} from '@angular/core';

@Component({
    selector: 'apmis-spinner',
    template: `<span *ngIf="visible"><i class="fa fa-circle-o-notch fa-spin fa-3x text-blue" aria-hidden="true"></i></span>`
})
export class ApmisSpinnerComponent{
   @Input() visible : boolean = true;
}