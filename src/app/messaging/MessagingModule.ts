import { NgModule } from '@angular/core';

import { MessagingComponent } from './messaging.component';
import {MessagingService} from "./messaging-service";
import {CommonModule} from "@angular/common";
import {Http} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {ChatHeaderComponent} from "./sub-components/ChatHeaderComponent";
import {ChannelListComponent} from "./sub-components/ChannelListComponent";
import {ChannelComponent} from "./sub-components/ChannelComponent";

@NgModule({
 imports: [CommonModule, Http,FormsModule],
 exports: [MessagingComponent],
 declarations:[]/* [MessagingComponent, ChatHeaderComponent, 
     ChannelListComponent, ChannelComponent]*/,
 providers: [MessagingService],
})
export class MessagingModule { }
