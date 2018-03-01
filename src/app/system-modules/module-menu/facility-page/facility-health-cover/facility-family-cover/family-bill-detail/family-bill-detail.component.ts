import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: 'app-family-bill-detail',
  templateUrl: './family-bill-detail.component.html',
  styleUrls: ['./family-bill-detail.component.scss']
})
export class FamilyBillDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  newWorkspace_onClick(employee) { }
  deletion_popup(workspace) {}

}
