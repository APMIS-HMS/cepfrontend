import { Component, OnInit, EventEmitter, Output, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.scss']
})
export class DocUploadComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  public frmNewUpload: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewUpload = this.formBuilder.group({
      fileUpload: ['', [<any>Validators.required]],
      fileName: ['', [<any>Validators.required]],
      fileType: ['', [<any>Validators.required]],
      desc: ['', [<any>Validators.required]]
    });
  }
  close_onClick(e){
    this.closeModal.emit(true);
  }

}
