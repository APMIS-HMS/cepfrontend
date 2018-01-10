import { Component, OnInit, EventEmitter, Output, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';

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
  loading: boolean;
  mainErr = true;
  errMsg = 'you have unresolved errors';
  fileBase64: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  public frmNewUpload: FormGroup;
  documentTypes: any;
  fileType:any;
  fileName:any;
  


  constructor(private formBuilder: FormBuilder, private docUploadService: DocumentUploadService,
    private patientService: PatientService,
    private personService: PersonService,
    private employeeService: EmployeeService,
    private facilityService: FacilitiesService,
    private billingService: BillingService,
    private formsService: FormsService,
    private formTypeService: FormTypeService,
    private locker: CoolLocalStorage
  ) { }

  ngOnInit() {
    this.frmNewUpload = this.formBuilder.group({
      fileUpload: ['', [<any>Validators.required]],
      fileName: ['', [<any>Validators.required]],
      fileType: ['', [<any>Validators.required]],
      desc: ['']
    });
    this.documentTypeFn();
  }
  close_onClick(e?){
    this.closeModal.emit(true);
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileName = file.name;
      if(file.type == "image/png" || file.type == "image/jpg" 
      || file.type == "image/gif" || file.type == "image/jpeg"
      || file.type == "application/pdf"){
        console.log(file);
        if (file.size < 1250000) {
          console.log(file);
          this.fileType = file.type;
          reader.readAsDataURL(file);
          reader.onload = () => {
            let base64 = reader.result;
            this.fileBase64 = base64;
          };
        } else {
          this.notification('Size Of Document Too BIG!', 'Error');
          this.frmNewUpload.controls['fileUpload'].setErrors({ sizeTooBig: true });
        }

      } else {
        this.notification('Type of document not supported.', 'Error');
        this.frmNewUpload.controls['fileUpload'].setErrors({ typeDenied: true });
      }
    }
  }

  uploadDocument(patient?: any) {
    this.loading = true;
    let uploadDoc;
    this.loading = true;
    
    if(this.locker.getObject('patient')){
      let upPatient = <any>this.locker.getObject('patient');
      uploadDoc = {
        base64: this.fileBase64,
        docType: this.frmNewUpload.controls['fileType'].value,
        docName: this.frmNewUpload.controls['fileName'].value,
        description: this.frmNewUpload.controls['desc'].value,
        fileType: this.fileType,
        patientId: upPatient._id,
        facilityId: this.facilityService.getSelectedFacilityId()._id
      }
    } else {
      uploadDoc = {
        base64: this.fileBase64,
        docType: this.frmNewUpload.controls['fileType'].value,
        docName: this.frmNewUpload.controls['fileName'].value,
        description: this.frmNewUpload.controls['desc'].value,
        patientId: patient._id,
        facilityId: this.facilityService.getSelectedFacilityId()._id
      }
    }
    console.log(uploadDoc);

    this.docUploadService.post(uploadDoc).then(payload => {
      console.log(payload);
      this.notification('Document Successfully Uploaded!', 'Success');
      this.loading = false;
      this.close_onClick(true);
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.loading = false;
    })

  }

  documentTypeFn() {
    this.formTypeService.findAll().then(payload => {
      console.log(payload);
      this.documentTypes = payload.data
    }).catch(err => {
      console.log(err);
    });
  }

  notification(text, type) {
    this.facilityService.announceNotification({
      type: type,
      text: text,
      users: [this.facilityService.getLoginUserId()]
    });
  }
}
