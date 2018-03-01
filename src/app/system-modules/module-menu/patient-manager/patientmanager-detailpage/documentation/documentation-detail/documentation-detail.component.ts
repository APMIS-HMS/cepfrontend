import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Facility, Patient, Employee, Documentation, PatientDocumentation, Document } from '../../../../../../models/index';
import { FormsService, FacilitiesService, DocumentationService } from '../../../../../../services/facility-manager/setup/index';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-documentation-detail',
  templateUrl: './documentation-detail.component.html',
  styleUrls: ['./documentation-detail.component.scss']
})
export class DocumentationDetailComponent implements OnInit {

  loginEmployee:any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() document: any = <any>{};
  @Input() isDocumentEdit: any = <any>{};
  @Input() patientDocumentationId:any;

  selectedPatientDocumentation:any;
  addendumCtrl:FormControl = new FormControl();


  constructor(private facilityService: FacilitiesService, private documentationService:DocumentationService,
  private authFacadeService:AuthFacadeService) { }

  ngOnInit() {
    // console.log(this.patientDocumentationId);
    // console.log(this.document);
    this.authFacadeService.getLogingEmployee().then(loginEmployee =>{
      this.loginEmployee  = loginEmployee;
      this.getPatientDocumentation();
    })

  }

  getPatientDocumentation(){
    this.documentationService.get(this.patientDocumentationId,{}).then(payload =>{
      console.log(payload);
      this.selectedPatientDocumentation = payload;
      if(this.document.document.addendium === undefined){
        this.document.document.addendium={
          date:new Date()
        };
      }
      console.log(this.document.document)
    }, error =>{

    });
  }
  close_onClick() {
    this.closeModal.emit(true);
  }

  save(){
    if(this.addendumCtrl.valid){
      let addendum:any = {};
      addendum.employeeId = this.loginEmployee._id;
      // addendum.
      // this.documentationService.addAddendum()
    }
  }

}
