import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HmoService } from '../../../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-new-beneficiary',
  templateUrl: './new-beneficiary.component.html',
  styleUrls: ['./new-beneficiary.component.scss']
})
export class NewBeneficiaryComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() beneficiaryValueChanged = new EventEmitter();
  // @Output() personValueChanged = new EventEmitter();
  @Input() selectedBeneficiary: any = <any>{};
  mainErr = true;
  errMsg = 'You have unresolved errors';
  public frm_UpdateCourse: FormGroup;
  genders = [];
  types = [];
  selectedFacility: any = <any>{};
  disableButton = false;

  constructor(private formBuilder: FormBuilder,
    private hmoService: HmoService,
    private systemModuleService: SystemModuleService,
    private locker: CoolLocalStorage) { }

  ngOnInit() {
    this.selectedFacility = this.locker.getObject('selectedFacility');
    this.frm_UpdateCourse = this.formBuilder.group({
      id: [''],
      index: [''],
      category: ['',[<any>Validators.required]],
      serial: [''],
      sponsor: ['', [<any>Validators.required]],
      type: ['', [<any>Validators.required],],
      plan: ['', [<any>Validators.required]],
      firstname: ['', [<any>Validators.required]],
      surname: ['', [<any>Validators.required]],
      gender: ['', [<any>Validators.required]],
      filNo: ['', [<any>Validators.required]],
      date: ['', [<any>Validators.required]],
      status: [false, [<any>Validators.required]]
    });
    this.genders = ['M', 'F'];
    this.types = ['CAPITATION', 'FEE-FOR-SERVICE'];
    this.selectedBeneficiary.type = (this.selectedBeneficiary.type !== undefined) ? this.removeWhiteSpace(this.selectedBeneficiary.type) : '';
    this.frm_UpdateCourse.setValue(this.selectedBeneficiary);
  }

  close_onClick() {
    this.frm_UpdateCourse.reset();
    this.closeModal.emit(true);
  }
  view() {
    if (this.frm_UpdateCourse.valid) {
      this.disableButton = true;
      if (this.selectedBeneficiary.index !== '') {
        this.systemModuleService.announceSweetProxy('You are about to edit this beneficiary report', 'question', this, null, null);
      } else {
        this.updateBeneficiaryList(this.frm_UpdateCourse.value);
      }
    } else {
      this.systemModuleService.announceSweetProxy('Require field(s) is missing', 'error');
    }
  }

  removeWhiteSpace(value) {
    return value.replace(/\s/g, '');
  }

  updateBeneficiaryList(value) {
    this.hmoService.patchBeneficiary(value.index, value, {
      query: {
        facilityId: this.selectedFacility._id, hmoId: value.id
      }
    }).then(payload => {
      this.disableButton = false;
      this.systemModuleService.announceSweetProxy('Beneficiary information updated', 'success');
      this.systemModuleService.off();
      this.beneficiaryValueChanged.emit(payload);
    });
  }

  sweetAlertCallback(result) {
    if (result.value) {
      this.systemModuleService.on();
      this.updateBeneficiaryList(this.frm_UpdateCourse.value);
    } else {
      this.close_onClick();
    }
  }

}
