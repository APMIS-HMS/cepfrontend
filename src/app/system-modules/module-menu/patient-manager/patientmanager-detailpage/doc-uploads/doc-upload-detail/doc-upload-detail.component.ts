import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-doc-upload-detail',
  templateUrl: './doc-upload-detail.component.html',
  styleUrls: ['./doc-upload-detail.component.scss']
})
export class DocUploadDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  close_onClick(e){
    this.closeModal.emit(true);
  }
}
