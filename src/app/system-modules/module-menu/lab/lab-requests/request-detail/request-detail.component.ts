import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  showDocument = false;
  hasNo= false;
  hasSample = false;
  hasSpecimen = false;

  constructor() { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  takeSample(){
    this.hasSample = true;
  }
  takeSpecimen(){
    this.hasSpecimen = true;
  }

}
