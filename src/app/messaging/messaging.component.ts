import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormControl } from '@angular/forms';
import {MessagingService} from "./messaging-service";
import {IMessage, IMessageChannel} from "./messaging-model";

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss'],
    encapsulation : ViewEncapsulation.None,
})
export class MessagingComponent implements OnInit {

  chatActive = false;
  searchAccount = new FormControl();
  chatBox = new FormControl();

  clinicalTab = true;
  nonClinicalTab = false;
    private clinicalChannels: IMessageChannel[];
    private nonClinicalChannels: IMessageChannel[];
    private totalOfflineMessageCount  = 0;
    selectedChannel : IMessageChannel   = null;
  constructor(private  msgService : MessagingService) { }

  ngOnInit() {
      this.clinicalChannels  =  this.findChannels({tag :  "clinical"});
      this.nonClinicalChannels  =  this.findChannels({tag :  "non-clinical"});
  }

  chatActiveToggle(){
    this.chatActive = !this.chatActive;
  }
  chatClose(){
    this.chatActive = false;
  }
  clinical_click(){
    this.clinicalTab = true;
    this.nonClinicalTab = false;
    // Get Channels for clinicalGroup
     
  }
  nonClinical_click(){
    this.clinicalTab = false;
    this.nonClinicalTab = true;
    
  }
 findChannels(criteria : any)
 {
   // loading channel
     const res  = this.msgService.getChannels(criteria);
     res.forEach(obj => {
        this.totalOfflineMessageCount += this.msgService.getChannelOfflineMessageCount(obj._id); 
       
     });
    return res;
 }
 channelSelected(channel)
 {
    // selected Channel  = channel;
     this.selectedChannel   = channel;
     // Load Channel Messages
     // Check if there are offline messages, mark them as read on the server
     // UI Should be rendered appropriately
  
 }
 showChannelDetails(channel : IMessageChannel)
 {
     alert("Showing Channel details for: " + channel.title + " with " + channel.users.length + " users");
 }
}
