import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'channel-list',
    template: `
        <ul class="chats-accs">
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
            <li class="chat-acc">
                <i class="fa fa-users group-ico"></i>
                <div class="chat-labels-wrap">
                    <div class="chat-label-name">Team Bella</div>
                    <div class="chat-label-other">Eye Clinic</div>
                </div>
                <div class="chat-time">Yesterday</div>
            </li>
            <li class="chat-acc">
                <div class="chat-img-wrap">
                    <img src="../../assets/images/users/default.png">
                </div>
                <div class="chat-labels-wrap">
                    <div class="chat-label-name">Janet James</div>
                    <div class="chat-label-other">EMT</div>
                </div>
                <div class="chat-time">10th March</div>
            </li>
        </ul>
    `
})

export class ChannelListComponent implements OnInit {
    constructor() {
    }

    ngOnInit() {
    }
}