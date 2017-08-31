import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewBeneficiary = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      phone: ['', [<any>Validators.required]],
      principalGender: ['', [<any>Validators.required]],
      principalstatus: ['', [<any>Validators.required]],
      principalEmpID: ['', [<any>Validators.required]]
    });

    this.frmDependant = this.formBuilder.group({
      dependantName: ['', [Validators.required]],
      dependantGender: ['', [Validators.required]],
      dependantEmail: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      dependantPhone: ['', [<any>Validators.required]],
      dependantStatus: ['', [<any>Validators.required]]
    });
  }

  newBeneficiary_show(){
    this.newBeneficiary = !this.newBeneficiary;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }

}
