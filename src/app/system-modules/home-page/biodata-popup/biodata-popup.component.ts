import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-biodata-popup',
  templateUrl: './biodata-popup.component.html',
  styleUrls: ['../home-page.component.scss']
})
export class BiodataPopupComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
