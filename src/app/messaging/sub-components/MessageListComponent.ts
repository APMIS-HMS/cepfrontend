import {Component, Input, OnInit,OnChanges, SimpleChanges} from '@angular/core';
import {IMessage, IMessageChannel, IMessenger, MessageStatus} from "../messaging-model";
/*
 *let include angular's Animation
* For version Angular V4 and below we need the web-animation polyfill for older browsers
* 
* */
import {transition, style, state, animate, trigger} from "@angular/animations";

@Component({
   /* animations : [
        trigger("messageListEntry" , [
            state("normal",style({ opacity : 0.7, transform : "scale(1.2)"})),
            state("entry",style({ opacity : 0.3, transform : "scale(0.7)"})),
            transition("entry <=> normal", animate(400, style({opacity : 1.0, transform: 'scale(1.0)'})))
        ])
    ],*/
    selector: 'message-list',
    template: `
        <div class="chat-sect">
            <ul class="chats">
                <!--[@messageListEntry] = "state"-->
                <div *ngFor="let m of messages;" >
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
            <textarea [disabled]="!(!!channel)" #txt (keyup)="sendMessage($event, txt)" class="chat-box"></textarea>
        </div>
    `
})

export class MessageListComponent implements OnInit, OnChanges {
    @Input() messages: IMessage[] = [];
    messagePager: any = {
        pageSize: 10,
        currentPage: 0,
        totalRecord: 0,
        totalPages: 0
    };
    state : string  = "entry";
    @Input() channel  : IMessageChannel;
    @Input() currentUser  : IMessenger
    
    
    constructor() {
        
    }

    sendMessage(evt: KeyboardEvent, ui : HTMLTextAreaElement) {
       
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
               
               this.messages.push(m);
               ui.value = "";
               ui.focus();
               // Scroll to Message
            }
        }
    }

    ngOnInit() {
    }
    ngOnChanges(simpleChange  : SimpleChanges)
    {
        if(simpleChange["messages"].currentValue != null)
        {
            ////console.log(sipmel)
        }
    }

}