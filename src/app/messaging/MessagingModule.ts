import { NgModule } from '@angular/core';

import { MessagingComponent } from './messaging.component';
import {MessagingService} from "./messaging-service";
import {CommonModule} from "@angular/common";
import {HttpModule} from "@angular/http";
import {ChatHeaderComponent} from "./sub-components/ChatHeaderComponent";
import {ChannelListComponent} from "./sub-components/ChannelListComponent";
import {ChannelComponent} from "./sub-components/ChannelComponent";
import {MessageComponent} from "./sub-components/MessageComponent";
import {MessageListComponent} from "./sub-components/MessageListComponent";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
 imports: [CommonModule, HttpModule, BrowserAnimationsModule],
 exports: [MessagingComponent],
 declarations:[MessagingComponent, ChatHeaderComponent, 
     ChannelListComponent, ChannelComponent, MessageComponent, MessageListComponent],
 providers: [MessagingService],
})
export class MessagingModule { }
