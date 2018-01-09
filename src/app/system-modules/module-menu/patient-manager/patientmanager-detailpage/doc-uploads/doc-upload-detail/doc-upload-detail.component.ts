import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {BrowserModule, DomSanitizer,SafeResourceUrl} from '@angular/platform-browser'

@Component({
  selector: 'app-doc-upload-detail',
  templateUrl: './doc-upload-detail.component.html',
  styleUrls: ['./doc-upload-detail.component.scss']
})
export class DocUploadDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  dataLocalUrl:any;
  pageurl:SafeResourceUrl;


  constructor(private domSanitizer:DomSanitizer) { }

  ngOnInit() {
    this.dataLocalUrl = "https://cdn.mozilla.net/pdfjs/tracemonkey.pdf";
    this.pageurl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.dataLocalUrl);
  }

  close_onClick(e){
    this.closeModal.emit(true);
  }
}
