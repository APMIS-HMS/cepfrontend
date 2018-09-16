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
                <div class="user-label">{{(channel?.title) || 'Select A Channel'}} </div>
            </div>

            <ul class="grp-members" *ngIf="channel" >
                <!--Loop-->
                <li *ngFor="let u of channel.users">
                    <span *ngIf="channel.users.length <= 5">{{u?.displayName || 'No Name'}} </span>
                    <span *ngIf="channel.users.length>5">...</span>
                </li>
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
