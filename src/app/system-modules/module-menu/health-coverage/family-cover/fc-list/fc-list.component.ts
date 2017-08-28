import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-fc-list',
  templateUrl: './fc-list.component.html',
  styleUrls: ['./fc-list.component.scss']
})
export class FcListComponent implements OnInit {

  @Output() showBeneficiaries: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('fileInput') fileInput: ElementRef;

  public frmNewFamily: FormGroup;
  principal = new FormControl('', []);
  newFamily = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewFamily = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      phone: ['', [<any>Validators.required]],
    });
  }

  newFamily_show() {
    this.newFamily = !this.newFamily;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }

  show_beneficiaries() {
    this.showBeneficiaries.emit(true);
  }
}
