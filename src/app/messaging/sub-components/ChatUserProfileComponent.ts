import {Component, OnInit, Input, Output} from '@angular/core';

@Component({
    selector: 'chat-user-profile',
    template: `
        <li class="chat-acc">
            <div class="chat-img-wrap">
                <img src="../../../assets/images/users/default.png">
            </div>
            <div class="chat-labels-wrap">
                <div class="chat-label-name">Solomon Dung</div>
                <div class="chat-label-other">Eye Clinic</div>
            </div>
            <div class="chat-time">8:00am</div>
        </li> 
    `
})

export class ChatUserProfileComponent implements OnInit {
    constructor() {
    }

    ngOnInit() {
    }
}