import { ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { MdPaginator } from '@angular/material';
import { FacilityCompanyCoverService } from './../../../../../services/facility-manager/setup/facility-company-cover.service';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
@Component({
  selector: 'app-company-beneficiary-list',
  templateUrl: './company-beneficiary-list.component.html',
  styleUrls: ['./company-beneficiary-list.component.scss']
})
export class CompanyBeneficiaryListComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  public frmNewBeneficiary: FormGroup;
  public frmDependant: FormGroup;
  beneficiary = new FormControl('', []);
  newBeneficiary = false;

  selectedFacility: any = <any>{};
  beneficiaries: any[] = [];
  filteredBeneficiaries: any[] = [];
  operateBeneficiaries: any[] = [];
  selectedCompanyCover: any = <any>{};

  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  @ViewChild(MdPaginator) paginator: MdPaginator;
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private locker: CoolLocalStorage,
    private companyCoverService: FacilityCompanyCoverService) { }

  ngOnInit() {
    this.frmNewBeneficiary = this.formBuilder.group({
      surname: ['', [Validators.required]],
      othernames: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
      phone: ['', [<any>Validators.required]],
      principalGender: ['', [<any>Validators.required]],
      principalstatus: ['', [<any>Validators.required]],
      principalEmpID: ['', [<any>Validators.required]]
    });

    // this.frmDependant = this.formBuilder.group({
    //   dependantSurname: ['', [Validators.required]],
    //   dependantOthernames: ['', [Validators.required]],
    //   dependantGender: ['', [Validators.required]],
    //   dependantEmail: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
    //   dependantPhone: ['', [<any>Validators.required]],
    //   dependantStatus: ['', [<any>Validators.required]]
    // });
    this.addDependant();
    this.route.params.subscribe(parameters => {
      this.getBeneficiaryList(parameters.id);
    })
  }
  addDependant() {
    this.frmDependant = this.formBuilder.group({
      'dependantArray': this.formBuilder.array([
        this.formBuilder.group({
          dependantSurname: ['', [Validators.required]],
          dependantOthernames: ['', [Validators.required]],
          dependantGender: ['', [Validators.required]],
          dependantEmail: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
          dependantPhone: ['', [<any>Validators.required]],
          dependantStatus: ['', [<any>Validators.required]],
          readOnly: [false]
        })
      ])
    });
  }
  pushNewDependant() {
    (<FormArray>this.frmDependant.controls['dependantArray'])
      .push(
      this.formBuilder.group({
        dependantSurname: ['', [Validators.required]],
        dependantOthernames: ['', [Validators.required]],
        dependantGender: ['', [Validators.required]],
        dependantEmail: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
        dependantPhone: ['', [<any>Validators.required]],
        dependantStatus: ['', [<any>Validators.required]],
        readOnly: [false]
      })
      );
  }
  closeDependant(dependant, i) {
    (<FormArray>this.frmDependant.controls['dependantArray']).controls.splice(i, 1);
    if ((<FormArray>this.frmDependant.controls['dependantArray']).controls.length === 0) {
      this.addDependant()
    }
  }
  newBeneficiary_show() {
    this.newBeneficiary = !this.newBeneficiary;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  getBeneficiaryList(id) {
    this.companyCoverService.find({ query: { 'facilityId._id': this.selectedFacility._id } }).then(payload => {
      if (payload.data.length > 0) {
        let facCompanyCover = payload.data[0];
        const index = facCompanyCover.companyCovers.findIndex(x => x.hmo._id === id);
        if (index > -1) {
          if (facCompanyCover.companyCovers[index].enrolleeList.length > 0) {
            this.selectedCompanyCover = facCompanyCover.companyCovers[index].hmo;
            this.beneficiaries = facCompanyCover.companyCovers[index].enrolleeList[0].enrollees;
            const startIndex = 0 * 10;
            this.operateBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
            this.filteredBeneficiaries = JSON.parse(JSON.stringify(this.operateBeneficiaries.splice(startIndex, this.paginator.pageSize)));
          }
        }
      }
    })
  }
  getRole(beneficiary) {
    let filNo = beneficiary.filNo;
    if (filNo !== undefined) {
      const filNoLength = filNo.length;
      const lastCharacter = filNo[filNoLength - 1];
      return isNaN(lastCharacter) ? 'D' : 'P';
    }
  }
  onPaginateChange(event) {
    const startIndex = event.pageIndex * event.pageSize;
    this.operateBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
    this.filteredBeneficiaries = JSON.parse(JSON.stringify(this.operateBeneficiaries.splice(startIndex, this.paginator.pageSize)));
  }
}
