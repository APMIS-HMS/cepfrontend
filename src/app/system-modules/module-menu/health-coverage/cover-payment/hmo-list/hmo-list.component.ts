import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hmo-bill-list',
  templateUrl: './hmo-list.component.html', 
  styleUrls: ['./hmo-list.component.scss']
})
export class HmoListComponent implements OnInit {

  @Output() hmolist: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  hmoList_click(){
    this.hmolist.emit(true);
  }

}
