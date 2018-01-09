import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BrowserModule, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { CoolLocalStorage } from 'angular2-cool-storage/src/cool-local-storage';

@Component({
  selector: 'app-doc-upload-detail',
  templateUrl: './doc-upload-detail.component.html',
  styleUrls: ['./doc-upload-detail.component.scss']
})
export class DocUploadDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  dataLocalUrl: any;
  pageurl: SafeResourceUrl;
  page = 1;
  auth: any;
  currentPDF = {};

  constructor(private domSanitizer: DomSanitizer, private locker: CoolLocalStorage) { }

  ngOnInit() {
    this.auth = this.locker.getObject('auth');
    console.log(this.auth);
    this.currentPDF = {
      // tslint:disable-next-line:max-line-length
      url: 'https://apmisstorageaccount.blob.core.windows.net/personcontainer/5a4f98b2f5173f049cc4eaa4_5901fe882fbd740bd0a702a0_1515498400547.pdf',
      // withCredentials: true,
      // httpHeaders: { 'Authorization': this.auth.token }
    };
    this.dataLocalUrl = 'https://cdn.mozilla.net/pdfjs/tracemonkey.pdf';
    this.pageurl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.dataLocalUrl);
  }

  close_onClick(e) {
    this.closeModal.emit(true);
  }
}
