import {Component, Input, OnInit} from '@angular/core';
import {IMessage, IMessageChannel, IMessenger, MessageStatus} from "../messaging-model";

@Component({
    selector: 'message-list',
    template: `
        <div class="chat-sect">
            <ul class="chats">
                <div *ngFor="let m of messages;">
                    <div class="in-msg" *ngIf="m.sender !== currentUser.id">
                        <li class="chat chat-center">
                           <message [message]="m"></message>
                        </li>
                       
                    </div> 
                    <div class="out-msg" *ngIf="m.sender === currentUser.id">
                    <li class="chat chat-center">
                        <message [message]="m"></message>
                    </li>

                </div>
                </div>
               
                
            </ul>
            <textarea [formControl]="chatBox" (keyup)="sendMessage($event)" class="chat-box"></textarea>
        </div>
    `
})

export class MessageListComponent implements OnInit {
    messages: IMessage[] = [];
    messagePager: any = {
        pageSize: 10,
        currentPage: 0,
        totalRecord: 0,
        totalPages: 0
    };
    @Input() channel  : IMessageChannel;
    @Input() currentUser  : IMessenger
    
    
    constructor() {
    }

    sendMessage(evt: KeyboardEvent, ui : HTMLInputElement) {
        if (evt.keyCode == 13) {
            // Enter key is Press
            // create a new Message from the target element.value property
            const msg  =  ui.value;
            if(msg.length && msg.length > 0 )
            {
               const  m : IMessage = {
                   // sent by the current User
                   sender : this.currentUser.id,
                   senderInfo : this.currentUser,
                   message : msg,
                   reciever : "group",
                   messageChannel : this.channel._id,
                   dateCreated : new Date(),
                   facilityId : this.channel._id,
                   channel : this.channel._id,
                   messageStatus : MessageStatus.Pending.toString() 
                   
               }
               
               this.messages.unshift(m);
               // Scroll to Message
            }
        }
    }

    ngOnInit() {
    }


}