import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {IMessageChannel} from "../messaging-model";

@Component({
    selector: 'channel-list',
    template: `
       
        <ul class="chats-accs" >
            <channel (onChannelClick)="channelClicked($event, index)" 
                     [channel]="channel" [selectedClass]="{'chat-channel-active' : index == selectedIndex }"
                     *ngFor="let channel of channelList; let index = index;"> </channel>
        </ul> 
    `
})

export class ChannelListComponent implements OnInit {
    constructor() {
    }
    @Output() onChannelSelected : EventEmitter<IMessageChannel>  = new EventEmitter<IMessageChannel>();
    @Input()channelList : IMessageChannel[]  =  [];
    // @Input()defaultSelected  : IMessageChannel  ; 
    selectedIndex : number  =-1;
    ngOnInit() {
       /* // get the dummy channel list
        if(this.defaultSelected != null)
        {
            // then let selected the appropiate index based on just the id of the channel
            this.channelList.forEach((obj, index) => {
                if(obj._id  === this.defaultSelected._id)
                {
                    this.selectedIndex  = index;

                }
            });
        }*/
    }
    
    channelClicked(channel: IMessageChannel , index : number)
    {
        this.onChannelSelected.emit(channel);
        this.selectedIndex  = index;
        
    }
    
    
    
    
}