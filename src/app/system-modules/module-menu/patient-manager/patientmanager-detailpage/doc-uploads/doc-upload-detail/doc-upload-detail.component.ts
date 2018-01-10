import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BrowserModule, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { CoolLocalStorage } from 'angular2-cool-storage/src/cool-local-storage';
import { PDFProgressData } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-doc-upload-detail',
  templateUrl: './doc-upload-detail.component.html',
  styleUrls: ['./doc-upload-detail.component.scss']
})
export class DocUploadDetailComponent implements OnInit {
  @Input() selectedDocument: any = {};
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  page = 1;
  auth: any;
  currentPDF = {};
  loading = true;

  constructor(private domSanitizer: DomSanitizer, private locker: CoolLocalStorage) { }

  ngOnInit() {
    this.auth = this.locker.getObject('auth');
    this.currentPDF = {
      url: this.selectedDocument.docUrl
    };
  }

  close_onClick(e) {
    this.closeModal.emit(true);
  }
  onComplete(event) {
    this.loading = false;
  }
  onError(event) {
  }
  onProgress(progressData: PDFProgressData) {
    // console.log(event);
  }
}
