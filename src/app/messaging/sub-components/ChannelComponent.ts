import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IMessage, IMessageChannel} from "../messaging-model";

@Component({
    selector: 'channel-component',
    template: `
        <li class="chat-acc"  (click) = "channelClickHandler()" style="cursor: pointer;">
            <div class="chat-img-wrap">
                <img src="../../../assets/images/users/default.png">
            </div>
            <div class="chat-labels-wrap">
                <div class="chat-label-name">{{channel.title}}</div>
                <div *ngIf="channel.lastMessage"  class="chat-label-other">{{channel.lastMessage.message}}</div>
            </div>
            <div *ngIf="channel.lastMessage"   class="chat-time">{{channel?.lastMessage?.dateCreated}}
                <!--Notification badge should be shown here if there any newer messages for this channel-->
            </div>
        </li>`
})

export class ChannelComponent implements OnInit {
    // we need pass in the IMessageChannel interface for Binding
    @Input() channel: IMessageChannel;
    
    // Whenever the component is clicked / tapped on, we raise a click event
    @Output() onChannelClick: EventEmitter<IMessageChannel> = new EventEmitter<IMessageChannel>();
    
    channelClickHandler()
    {
        this.onChannelClick.emit(this.channel);
    }
    
    constructor() {
    }
    
    ngOnInit() {
    }
}