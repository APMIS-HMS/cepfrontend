import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: 'app-hmo-bill-history-detail',
  templateUrl: './hmo-bill-history-detail.component.html',
  styleUrls: ['./hmo-bill-history-detail.component.scss']
})
export class HmoBillHistoryDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }
  
  close_onClick() {
    this.closeModal.emit(true);
  }

}
