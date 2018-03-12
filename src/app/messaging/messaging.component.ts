import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit {

  chatActive = false;
  searchAccount = new FormControl();

  constructor() { }

  ngOnInit() {
  }

  chatActiveToggle(){
    this.chatActive = !this.chatActive;
  }
  chatClose(){
    this.chatActive = false;
  }

}
