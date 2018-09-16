import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormControl } from '@angular/forms';
import {MessagingService} from "./messaging-service";
import {IMessageChannel} from "./messaging-model";

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
    return this.msgService.getChannels(criteria);
 }
 channelSelected(channel)
 {
    // selected Channel  = channel;
     this.selectedChannel   = channel;
     console.log(channel);
 }
}
