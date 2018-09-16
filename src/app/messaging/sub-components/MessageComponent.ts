import {Component, Input, OnInit} from '@angular/core';
import {IMessage} from "../messaging-model";

@Component({
    selector: 'message',
    template: `
        <div class="">
            <div class="chat-in-user">{{message?.senderInfo?.displayName}}</div>
            <div class="chat-payload">{{message?.message}}</div>
            <div class="chat-in-time">{{message?.dateCreated | date:'dd-mm-yyyy'}}</div>
        </div>
    `
})

export class MessageComponent implements OnInit {
    @Input() message : IMessage;
    
    constructor() {
    }

    ngOnInit() {
    }
}