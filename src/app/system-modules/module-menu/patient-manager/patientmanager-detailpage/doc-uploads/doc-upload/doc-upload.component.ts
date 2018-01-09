import { Component, OnInit, EventEmitter, Output, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import {
  DocumentUploadService, PatientService, PersonService, EmployeeService, FacilitiesService, FacilitiesServiceCategoryService,
  BillingService, FormsService
} from '../../../../../../services/facility-manager/setup/index';

import { FormTypeService, ScopeLevelService } from '../../../../../../services/module-manager/setup/index';

@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.scss']
})
export class DocUploadComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';
  fileBase64: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  public frmNewUpload: FormGroup;
  documentTypes: any;
  

  constructor(private formBuilder: FormBuilder, private docUploadService: DocumentUploadService, 
    private patientService: PatientService,
    private personService: PersonService,
    private employeeService: EmployeeService,
    private facilityService: FacilitiesService,
    private billingService: BillingService,
    private formsService: FormsService,
    private formTypeService: FormTypeService
  ) { }

  ngOnInit() {
    this.frmNewUpload = this.formBuilder.group({
      fileUpload: ['', [<any>Validators.required]],
      fileName: ['', [<any>Validators.required]],
      fileType: ['', [<any>Validators.required]],
      desc: ['', [<any>Validators.required]]
    });
    this.documentTypeFn();
  }
  close_onClick(e){
    this.closeModal.emit(true);
  }

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        let base64 = reader.result;
        this.fileBase64 = base64;
        console.log(reader, file, base64);
      };
    }
  }

  uploadDocument(){
    let uploadDoc = {
      base64: this.fileBase64,
      docType: this.frmNewUpload.controls['fileType'].value,
      docName: this.frmNewUpload.controls['fileName'].value,
      description: this.frmNewUpload.controls['desc'].value
    }
    console.log(uploadDoc);

    this.docUploadService.post(uploadDoc).then(payload => {
      console.log(payload);
    }).catch(err => {
      console.log(JSON.stringify(err));
    })

  }

  documentTypeFn(){
    this.formTypeService.findAll().then(payload => {
      console.log(payload);
      this.documentTypes = payload.data
    }).catch(err => {
      console.log(err);
    });
  }

}
