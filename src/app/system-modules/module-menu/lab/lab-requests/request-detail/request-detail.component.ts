import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('fileInput') fileInput:ElementRef;
  
  showDocument = false;
  hasNo= false;
  hasSample = false;
  hasSpecimen = false;
  hasLabNo = false;

  constructor( private renderer:Renderer) { }

  ngOnInit() {
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  onChange(){
    //upload file
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
  assignLabNo(){
    this.hasLabNo = true;
  }

}
