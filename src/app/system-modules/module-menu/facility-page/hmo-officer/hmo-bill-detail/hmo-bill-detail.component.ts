import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-hmo-bill-detail',
  templateUrl: './hmo-bill-detail.component.html',
  styleUrls: ['./hmo-bill-detail.component.scss']
})
export class HmoBillDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  hmoTypeControl: FormControl = new FormControl();
  authCodeControl: FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  newWorkspace_onClick(employee) { }
  deletion_popup(workspace) {}

}
