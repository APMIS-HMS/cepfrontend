import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Facility, Patient, Employee, Documentation, PatientDocumentation, Document } from '../../../../../../models/index';
import { FormsService, FacilitiesService, DocumentationService } from '../../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-documentation-detail',
  templateUrl: './documentation-detail.component.html',
  styleUrls: ['./documentation-detail.component.scss']
})
export class DocumentationDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() document: any = <any>{};
  @Input() isDocumentEdit: any = <any>{};
  @Input() patientDocumentationId:any;



  constructor(private facilityService: FacilitiesService, private documentationService:DocumentationService) { }

  ngOnInit() {
    console.log(this.patientDocumentationId);
    console.log(this.document);
    this.documentationService.get(this.patientDocumentationId,{}).then(payload =>{

    }, error =>{

    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }


}
