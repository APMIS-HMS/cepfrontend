import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-workspace-history',
  templateUrl: './workspace-history.component.html',
  styleUrls: ['./workspace-history.component.scss']
})
export class WorkspaceHistoryComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  close_onClick() {
      this.closeModal.emit(true);
  }

}
