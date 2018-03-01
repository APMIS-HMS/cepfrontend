import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-family-bill-history-detail',
  templateUrl: './family-bill-history-detail.component.html',
  styleUrls: ['./family-bill-history-detail.component.scss']
})
export class FamilyBillHistoryDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
