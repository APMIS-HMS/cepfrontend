import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-treatement-template',
  templateUrl: './treatement-template.component.html',
  styleUrls: ['./treatement-template.component.scss']
})
export class TreatementTemplateComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  public frmnewTemplate: FormGroup;
  newTemplate = false;

  isOrderSet = false;
  isDocumentation = true;

  showMedService = true;
  showLabService = true;
  showNursingCareService = true;
  showPhysicianOrderService = true;
  showProcedureService = true;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmnewTemplate = this.formBuilder.group({
      name: ['', [Validators.required]],
      diagnosis: [''],
      visibility: [''],
      isEditable: [''],
      type: ['', [<any>Validators.required]],
      docFrmList: [''],
      chkLab: [''],
      chkMed: [''],
      chkDiagnostic: [''],
      chkProcedure: [''],
      chkImmunization: [''],
      chkNursing: [''],
      chkPhysician: [''],
    });

    this.frmnewTemplate.controls['type'].valueChanges.subscribe(value => {
      console.log(value);
      if (value === 'Documentation') {
        this.isDocumentation = true;
        this.isOrderSet = false;
      } else {
        this.isOrderSet = true;
        this.isDocumentation = false;
      }
    })
  }

  newTemplate_show() {
    this.newTemplate = !this.newTemplate;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  public upload(e) {
    // console.log('am here')

    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append("excelfile", fileBrowser.files[0]);
      // formData.append("companyCoverId", companyCover._id);
      // this.facilityService.upload(formData, this.selectedCompanyCover._id).then(res => {
      //   console.log(res);
      //   let enrolleeList: any[] = [];
      //   if (res.body !== undefined && res.body.error_code === 0) {
      //     res.body.data.Sheet1.forEach(row => {
      //       let rowObj: any = <any>{};
      //       rowObj.serial = row.A;
      //       rowObj.surname = row.B;
      //       rowObj.firstName = row.C;
      //       rowObj.gender = row.D;
      //       rowObj.filNo = row.E;
      //       rowObj.category = row.F;
      //       rowObj.date = this.excelDateToJSDate(row.G);
      //       enrolleeList.push(rowObj);
      //     });
      //     console.log(enrolleeList);
      //     const index = this.loginHMOListObject.companyCovers.findIndex(x => x._id === companyCover._id);
      //     let facHmo = this.loginHMOListObject.companyCovers[index];
      //     let enrolleeItem = {
      //       month: new Date().getMonth() + 1,
      //       year: new Date().getFullYear(),
      //       enrollees: enrolleeList
      //     }
      //     facHmo.enrolleeList.push(enrolleeItem);
      //     this.loginHMOListObject.companyCovers[index] = facHmo;
      //     this.companyCoverService.update(this.loginHMOListObject).then(pay => {
      //       this.getLoginHMOList();
      //     })
      //   }
      // }).catch(err => {
      //   this._notification('Error', "There was an error uploading the file");
      // });
    }
  }
  show_beneficiaries(){
    
  }
}
