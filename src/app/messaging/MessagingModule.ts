import { NgModule } from '@angular/core';

import { MessagingComponent } from './messaging.component';
import {MessagingService} from "./messaging-service";
import {CommonModule} from "@angular/common";
import {Http} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {ChatHeaderComponent} from "./sub-components/ChatHeaderComponent";

@NgModule({
 imports: [CommonModule, Http,FormsModule],
 exports: [MessagingComponent],
 declarations: [MessagingComponent, ChatHeaderComponent],
 providers: [MessagingService],
})
export class MessagingModule { }
