import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hmo-cover',
  templateUrl: './hmo-cover.component.html',
  styleUrls: ['./hmo-cover.component.scss']
})
export class HmoCoverComponent implements OnInit {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    this.pageInView.emit('HMO');
  }

}
