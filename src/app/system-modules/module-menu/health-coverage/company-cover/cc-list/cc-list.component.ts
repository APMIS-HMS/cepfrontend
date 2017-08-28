import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-cc-list',
  templateUrl: './cc-list.component.html',
  styleUrls: ['./cc-list.component.scss']
})
export class CcListComponent implements OnInit {

  @Output() showBeneficiaries: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('fileInput') fileInput: ElementRef;

  public frmNewCompany: FormGroup;
  frmNewPlan: FormGroup;
  company = new FormControl('', []);
  newCompany = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewCompany = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      phone: ['', [<any>Validators.required]],
    });

    this.frmNewPlan = this.formBuilder.group({
      plans: ['', []]
    });
  }

  newCompany_show() {
    this.newCompany = !this.newCompany;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }

  show_beneficiaries() {
    this.showBeneficiaries.emit(true);
  }
}
