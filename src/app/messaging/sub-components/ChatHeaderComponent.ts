import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ViewEncapsulation} from "@angular/core";
import {IMessageChannel} from "../messaging-model";

@Component({
    selector: 'chat-header',
    //encapsulation : ViewEncapsulation.None,
    template: `
        <div class="container-header">
            <div class="user-wrap" (click)="emitHeaderClick()">
               <i class="fa fa-users group-ico"></i>
                <div class="user-label">{{(channel?.title) || 'Channel'}} </div>
            </div>

            <ul class="grp-members" >
                <!--Loop-->
                <li>Sam Daniel</li>
                <li>Jude Jeremy</li>
                <li>Rita Wales</li>
                <li>Juanita Davis</li>
                <li>Pamela Jonathan</li>
                <li>Solomon Wise</li>
                <li>Kings Philips</li>
            </ul>

            <div class="header-icos">
                <div (click)="chatClose()" class="x">X</div>
            </div>
        </div>
    `
})

export class ChatHeaderComponent implements OnInit {
    constructor() {
    }
    @Input() channel :  IMessageChannel;
    @Output() onClick : EventEmitter<IMessageChannel> =  new EventEmitter<IMessageChannel>();
    @Output() onClose : EventEmitter<boolean>  = new EventEmitter<boolean>();
    ngOnInit() {
    }
    
    emitHeaderClick()
    {
        this.onClick.emit(this.channel);
    }
    chatClose()
    {
        this.onClose.emit(true);
    }
}
