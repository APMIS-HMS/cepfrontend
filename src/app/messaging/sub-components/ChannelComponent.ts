import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {IMessageChannel} from "../messaging-model";
import {MessagingService} from "../messaging-service";

@Component({
    selector: 'channel',
    encapsulation : ViewEncapsulation.None,
    template: `
        <li class="chat-acc pos-relative" [ngClass]="selectedClass"  (click) = "channelClickHandler()" style="cursor: pointer;">
            <div class="chat-img-wrap">
                <img src="../../../assets/images/users/default.png">
            </div>
            <div class="chat-labels-wrap">
                <div class="chat-label-name">{{channel.title}}</div>
                <div *ngIf="channel.lastMessage"  class="chat-label-other  ">{{shortMessage}}
                    <!--Notification badge should be shown here if there any newer messages for this channel-->
                    <span *ngIf="channel.totalOfflineMessage && channel.totalOfflineMessage>0" class="offline-count ">{{channel.totalOfflineMessage | number}}</span>
                </div>
            </div>
            <div *ngIf="channel.lastMessage"   class="chat-time">{{channel?.lastMessage?.dateCreated | date:'hh:mm'}}
                
            </div>
            
        </li>`,
    styles : [`
        .pos-relative
        {
            position:relative;
        }
        span.offline-count
        {
            position: absolute;
            right: 10px;
            bottom : 10px;
            background-color: red;
            color : white;
            padding: 4px;
            font-size: 10px;
            border-radius: 50px;
            
        }
    `]
})

export class ChannelComponent implements OnInit , OnChanges{
    // we need pass in the IMessageChannel interface for Binding
    private MSG_LENGTH = 40;
    @Input() channel: IMessageChannel;
    @Input() selectedClass: any;
    shortMessage : string  = ""; 
    // Whenever the component is clicked / tapped on, we raise a click event
    @Output() onChannelClick: EventEmitter<IMessageChannel> = new EventEmitter<IMessageChannel>();
    
    channelClickHandler()
    {
        this.onChannelClick.emit(this.channel);
        console.log(this.shortMessage);
    }
    
    constructor(private msgService  : MessagingService) {
    }
    
    ngOnInit() {
        if(this.channel)
        {
            this.channel.totalOfflineMessage =  this.msgService.getChannelOfflineMessageCount(this.channel._id);
        }
        if(this.channel.lastMessage)
        {
            if(this.channel.lastMessage.message)
            {
                this.shortMessage  = this.channel.lastMessage.message.length >= this.MSG_LENGTH ? this.channel.lastMessage.message.substring(0,this.MSG_LENGTH) +"..." : this.channel.lastMessage.message;
            }
            else{
                this.shortMessage = "lastMessage.message not set";
            }
        }
        
    }
    ngOnChanges(simpleChange : SimpleChanges)
    {
        
        // set the default shortMessage whenever a Last Message is known
       
        /*if(simpleChange["channel"].currentValue != null)
        {
            const chn : IMessageChannel = <IMessageChannel>simpleChange["channel"].currentValue;
            if(chn.lastMessage.message)
            {
                this.shortMessage  = chn.lastMessage.message.length >= this.MSG_LENGTH ? chn.lastMessage.message.substring(0,this.MSG_LENGTH) : chn.lastMessage.message;
            }
            
        }*/
    }
}